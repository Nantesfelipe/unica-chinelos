const crypto = require('crypto');

const {
  criarPedidoComItens,
  devolverEstoquePedido,
  atualizarMercadoPagoId,
  atualizarStatusPedido,
  atualizarStatusEFormaPagamento,
  listarPedidosPorUsuario,
  listarTodosPedidos,
  buscarPedidoComItens,
  cancelarPedido,
 
} = require('../models/orderModel');

const {
  MercadoPagoConfig,
  Preference,
  Payment,
} = require('mercadopago');

const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

const preferenceClient = new Preference(mercadoPagoClient);
const paymentClient = new Payment(mercadoPagoClient);

async function finalizar(req, res) {
  let pedidoCriado = null;

  try {
    const { itens,  cupomId, modalidadeFrete } = req.body;

    if (!Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({
        erro: 'O pedido precisa ter ao menos um item.',
      });
    }

    for (const item of itens) {
      if (
        !Number.isInteger(Number(item.variacaoId)) ||
        !Number.isInteger(Number(item.quantidade)) ||
        Number(item.quantidade) <= 0
      ) {
        return res.status(400).json({
          erro:
            'Cada item deve possuir uma variação válida e uma quantidade maior que zero.',
        });
      }
    }

    /*
     * 1. Cria o pedido, recalculando cupom e frete no
     * servidor (nunca confiando em valores vindos do front),
     * e reserva o estoque.
     */
    pedidoCriado = await criarPedidoComItens({
      usuarioId: req.usuario.id,
      itens,
      cupomId,
      modalidadeFrete,
    });

    /*
     * 2. Busca os detalhes completos para montar a preferência.
     */
    const pedidoDetalhado = await buscarPedidoComItens(pedidoCriado.id);

    if (!pedidoDetalhado) {
      throw new Error('Não foi possível recuperar o pedido criado.');
    }

    /*
     * 3. Monta os itens da preferência: produtos + frete (se houver)
     * + desconto do cupom (se houver) como item negativo.
     */
    const itensPreferencia = (pedidoDetalhado.itens || []).map((item) => ({
      id: String(item.variacao_id),
      title: item.produto,
      quantity: Number(item.quantidade),
      unit_price: Number(item.preco_unitario),
      currency_id: 'BRL',
    }));

    if (Number(pedidoDetalhado.valor_frete) > 0) {
      itensPreferencia.push({
        id: 'frete',
        title: 'Frete',
        quantity: 1,
        unit_price: Number(pedidoDetalhado.valor_frete),
        currency_id: 'BRL',
      });
    }

    if (Number(pedidoDetalhado.valor_desconto) > 0) {
      itensPreferencia.push({
        id: 'desconto',
        title: 'Desconto (cupom)',
        quantity: 1,
        unit_price: -Number(pedidoDetalhado.valor_desconto),
        currency_id: 'BRL',
      });
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      throw new Error(
        'BACKEND_URL não configurada — necessária para o webhook do Mercado Pago.'
      );
    }

    /*
     * 4. Cria a preferência no Mercado Pago.
     */
    const preference = await preferenceClient.create({
      body: {
        external_reference: String(pedidoCriado.id),

        payer: {
          name: req.usuario.nome,
          email: req.usuario.email,
        },

        items: itensPreferencia,

        back_urls: {
          success: `${frontendUrl}/pedido/sucesso`,
          pending: `${frontendUrl}/pedido/pendente`,
          failure: `${frontendUrl}/pedido/erro`,
        },

        // auto_return: 'approved',

        notification_url: `${backendUrl}/orders/webhook`,
      },
    });

    /*
     * 5. Salva o ID da preferência no pedido.
     */
    const pedidoAtualizado = await atualizarMercadoPagoId(
      pedidoCriado.id,
      preference.id
    );

    if (!pedidoAtualizado) {
      throw new Error(
        'Pedido criado, mas não foi possível salvar o ID do Mercado Pago.'
      );
    }

    /*
     * 6. Retorna os dados necessários para o frontend.
     */
    res.status(201).json({
      pedido: pedidoAtualizado,
      preferenceId: preference.id,
      initPoint: preference.init_point,
    });
  } catch (err) {
    console.error('Erro ao criar pedido/pagamento:', err);

    /*
     * Se o pedido já foi criado e algo falhou depois,
     * devolvemos o estoque reservado.
     */
    if (pedidoCriado?.id) {
      try {
        await devolverEstoquePedido(pedidoCriado.id);
        await atualizarStatusPedido(pedidoCriado.id, 'cancelado');
      } catch (erroEstoque) {
        console.error('Erro ao desfazer reserva do estoque:', erroEstoque);
      }
    }

    const errosConhecidos = {
      INVALID_COUPON: 400,
      COUPON_EXPIRED: 400,
      INVALID_SHIPPING: 400,
      INCOMPLETE_ADDRESS: 400,
      INSUFFICIENT_STOCK: 400,
      VARIATION_NOT_FOUND: 400,
    };

    const status = errosConhecidos[err.code] || 500;

    res.status(status).json({
      erro:
        status === 500
          ? 'Não foi possível iniciar o pagamento.'
          : err.message,
    });
  }
}

/*
 * Valida a assinatura enviada pelo Mercado Pago no header
 * x-signature, pra garantir que a notificação é legítima.
 */
function validarAssinaturaWebhook(req, dataId) {
  const signatureHeader = req.headers['x-signature'];
  const requestId = req.headers['x-request-id'];

  if (!signatureHeader || !requestId || !dataId) {
    return false;
  }

  const partes = signatureHeader.split(',').reduce((acc, parte) => {
    const [chave, valor] = parte.split('=');
    acc[chave.trim()] = valor?.trim();
    return acc;
  }, {});

  const { ts, v1 } = partes;

  if (!ts || !v1) {
    return false;
  }

  const template = `id:${dataId};request-id:${requestId};ts:${ts};`;

  const assinaturaCalculada = crypto
    .createHmac('sha256', process.env.MERCADO_PAGO_WEBHOOK_SECRET)
    .update(template)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(assinaturaCalculada),
      Buffer.from(v1)
    );
  } catch {
    return false;
  }
}

/*
 * Mapeia o status do Mercado Pago para o status_pagamento
 * do pedido.
 */
const MAPA_STATUS_PAGAMENTO = {
  approved: 'aprovado',
  pending: 'pendente',
  in_process: 'pendente',
  rejected: 'rejeitado',
  cancelled: 'cancelado',
  refunded: 'estornado',
  charged_back: 'estornado',
};

async function webhook(req, res) {
  try {
    const dataId = req.query['data.id'] || req.body?.data?.id;
    const tipo = req.query.type || req.body?.type;

    if (tipo !== 'payment' || !dataId) {
      /*
       * Mercado Pago manda outros tipos de notificação
       * (ex: merchant_order) que não precisamos tratar aqui.
       */
      return res.status(200).send();
    }

    if (!validarAssinaturaWebhook(req, dataId)) {
      console.warn('Webhook do Mercado Pago com assinatura inválida.');
      return res.status(401).send();
    }

    const pagamento = await paymentClient.get({ id: dataId });
    const pedidoId = Number(pagamento.external_reference);

    if (!pedidoId) {
      return res.status(200).send();
    }

    const pedido = await buscarPedidoComItens(pedidoId);

    if (!pedido) {
      return res.status(200).send();
    }

    const statusPagamento =
      MAPA_STATUS_PAGAMENTO[pagamento.status] || 'pendente';

    /*
     * Idempotência: se já processamos esse status, não faz
     * nada de novo (evita devolver estoque duas vezes se o
     * webhook chegar repetido).
     */
    if (pedido.status_pagamento === statusPagamento) {
      return res.status(200).send();
    }

    await atualizarStatusPagamento(pedidoId, statusPagamento);

    if (statusPagamento === 'rejeitado' || statusPagamento === 'cancelado') {
      await devolverEstoquePedido(pedidoId);
      await atualizarStatusPedido(pedidoId, 'cancelado');
    }

    res.status(200).send();
  } catch (err) {
    console.error('Erro ao processar webhook do Mercado Pago:', err);

    /*
     * Retornamos 200 mesmo em erro interno pra evitar que o
     * Mercado Pago fique reenviando indefinidamente; o erro
     * já foi logado pra investigação manual.
     */
    res.status(200).send();
  }
}

const STATUS_VALIDOS = [
  'recebido',
  'em_separacao',
  'enviado',
  'entregue',
  'cancelado',
];

async function atualizarStatus(req, res) {
  try {
    const { status } = req.body;

    if (!STATUS_VALIDOS.includes(status)) {
      return res.status(400).json({
        erro: 'Status inválido.',
      });
    }

    const pedido = await atualizarStatusPedido(req.params.id, status);

    if (!pedido) {
      return res.status(404).json({
        erro: 'Pedido não encontrado.',
      });
    }

    res.json(pedido);
  } catch (err) {
    res.status(500).json({
      erro: err.message,
    });
  }
}

async function meusPedidos(req, res) {
  try {
    const pedidos = await listarPedidosPorUsuario(req.usuario.id);

    res.json(pedidos);
  } catch (err) {
    res.status(500).json({
      erro: err.message,
    });
  }
}

async function detalhesPedido(req, res) {
  try {
    const pedido = await buscarPedidoComItens(req.params.id);

    if (!pedido) {
      return res.status(404).json({
        erro: 'Pedido não encontrado.',
      });
    }

    if (pedido.usuario_id !== req.usuario.id && req.usuario.tipo !== 'admin') {
      return res.status(403).json({
        erro: 'Acesso negado a este pedido.',
      });
    }

    res.json(pedido);
  } catch (err) {
    res.status(500).json({
      erro: err.message,
    });
  }
}

async function todosPedidos(req, res) {
  try {
    const pedidos = await listarTodosPedidos();

    res.json(pedidos);
  } catch (err) {
    res.status(500).json({
      erro: err.message,
    });
  }
}

async function cancelarPedidoController(req, res) {
  try {
    const pedido = await cancelarPedido(
      Number(req.params.id),
      req.usuario.id
    );

    res.json(pedido);
  } catch (err) {
    if (err.code === 'ORDER_NOT_FOUND') {
      return res.status(404).json({
        erro: err.message,
      });
    }

    if (err.code === 'ORDER_FORBIDDEN') {
      return res.status(403).json({
        erro: err.message,
      });
    }

    if (err.code === 'ORDER_CANNOT_CANCEL') {
      return res.status(400).json({
        erro: err.message,
      });
    }

    res.status(500).json({
      erro: err.message,
    });
  }
}

module.exports = {
  finalizar,
  atualizarStatus,
  meusPedidos,
  todosPedidos,
  detalhesPedido,
  cancelarPedido: cancelarPedidoController,
  webhook,
};