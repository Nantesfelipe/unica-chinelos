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

const { buscarPorId } = require('../models/userModel');

const {
  MercadoPagoConfig,
  Payment,
} = require('mercadopago');

const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

const paymentClient = new Payment(mercadoPagoClient);

/*
 * Mapeia o status do Mercado Pago
 * para o status do pedido.
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

async function finalizar(req, res) {
  let pedidoCriado = null;

  try {
    const { itens, cupomId, modalidadeFrete } = req.body;

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

    pedidoCriado = await criarPedidoComItens({
      usuarioId: req.usuario.id,
      itens,
      cupomId,
      modalidadeFrete,
    });

    const pedidoDetalhado = await buscarPedidoComItens(
      pedidoCriado.id
    );

    if (!pedidoDetalhado) {
      throw new Error(
        'Não foi possível recuperar o pedido criado.'
      );
    }

    res.status(201).json({
      pedido: pedidoDetalhado,
    });
  } catch (err) {
    console.error(
      'Erro ao criar pedido:',
      err
    );

    if (pedidoCriado?.id) {
      try {
        await devolverEstoquePedido(
          pedidoCriado.id
        );

        await atualizarStatusPedido(
          pedidoCriado.id,
          'cancelado'
        );
      } catch (erroEstoque) {
        console.error(
          'Erro ao desfazer reserva do estoque:',
          erroEstoque
        );
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

    const status =
      errosConhecidos[err.code] || 500;

    res.status(status).json({
      erro:
        status === 500
          ? 'Não foi possível criar o pedido.'
          : err.message,
    });
  }
}

async function processarPagamento(req, res) {
  try {
    const pedidoId = Number(req.params.id);

    const {
      token,
      payment_method_id,
      issuer_id,
      installments,
      payer,
    } = req.body;

    const pedido = await buscarPedidoComItens(pedidoId);

    if (!pedido) {
      return res.status(404).json({
        erro: 'Pedido não encontrado.',
      });
    }

    if (pedido.usuario_id !== req.usuario.id) {
      return res.status(403).json({
        erro: 'Você não tem permissão para pagar este pedido.',
      });
    }

    if (pedido.status_pagamento === 'aprovado') {
      return res.status(400).json({
        erro: 'Este pedido já foi pago.',
      });
    }

    const usuarioCompleto = await buscarPorId(req.usuario.id);

    const backendUrl = process.env.BACKEND_URL;

    if (!backendUrl) {
      throw new Error(
        'BACKEND_URL não configurada.'
      );
    }

    // ⚠️ valor sempre vem do banco, nunca do frontend.
    const pagamento = await paymentClient.create({
      body: {
        transaction_amount: Number(pedido.valor_final),
        token,
        description: `Pedido #${pedido.id} - Única Chinelos`,
        installments: Number(installments) || 1,
        payment_method_id,
        issuer_id,
        payer: {
          email: payer?.email || usuarioCompleto?.email,
          identification: payer?.identification,
        },
        external_reference: String(pedido.id),
        notification_url: `${backendUrl}/orders/webhook`,
      },
    });

    const statusPagamento =
      MAPA_STATUS_PAGAMENTO[pagamento.status] || 'pendente';

    await atualizarStatusEFormaPagamento(
      pedido.id,
      statusPagamento,
      pagamento.payment_type_id
    );

    await atualizarMercadoPagoId(pedido.id, String(pagamento.id));

    if (statusPagamento === 'rejeitado') {
      await devolverEstoquePedido(pedido.id);
      await atualizarStatusPedido(pedido.id, 'cancelado');
    }

    res.status(201).json({
      status: pagamento.status,
      statusDetail: pagamento.status_detail,
      pedidoId: pedido.id,
      paymentId: pagamento.id,
      pontoDeInteracao: pagamento.point_of_interaction || null,
    });
  } catch (err) {
    console.error('Erro ao processar pagamento:', err);

    res.status(500).json({
      erro: 'Não foi possível processar o pagamento.',
    });
  }
}

/*
 * Valida a assinatura enviada pelo Mercado Pago.
 */
function validarAssinaturaWebhook(req, dataId) {
  const signatureHeader =
    req.headers['x-signature'];

  const requestId =
    req.headers['x-request-id'];

  if (
    !signatureHeader ||
    !requestId ||
    !dataId
  ) {
    return false;
  }

  const partes = signatureHeader
    .split(',')
    .reduce((acc, parte) => {
      const [chave, valor] =
        parte.split('=');

      acc[chave.trim()] = valor?.trim();

      return acc;
    }, {});

  const { ts, v1 } = partes;

  if (!ts || !v1) {
    return false;
  }

  const secret =
    process.env.MERCADO_PAGO_WEBHOOK_SECRET;

  if (!secret) {
    console.error(
      'MERCADO_PAGO_WEBHOOK_SECRET não configurado.'
    );

    return false;
  }

  const template =
    `id:${dataId};request-id:${requestId};ts:${ts};`;

  const assinaturaCalculada =
    crypto
      .createHmac('sha256', secret)
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
 * Webhook do Mercado Pago.
 */
async function webhook(req, res) {
  try {

    console.log('Webhook recebido:', { tipo: req.query.type || req.body?.type });
    
    const dataId =
      req.query['data.id'] ||
      req.body?.data?.id;
    console.log('DATA ID EXTRAÍDO:', dataId);
    const tipo =
      req.query.type ||
      req.body?.type;

    if (tipo !== 'payment' || !dataId) {
      return res.status(200).send();
    }

    if (
      !validarAssinaturaWebhook(
        req,
        dataId
      )
    ) {
      console.warn(
        'Webhook do Mercado Pago com assinatura inválida.'
      );

      return res.status(401).send();
    }

    const pagamento =
      await paymentClient.get({
        id: dataId,
      });

    console.log(
      'Pagamento recebido pelo webhook:',
      {
        id: pagamento.id,
        status: pagamento.status,
        payment_type_id:
          pagamento.payment_type_id,
        external_reference:
          pagamento.external_reference,
      }
    );

    const pedidoId = Number(
      pagamento.external_reference
    );

    if (!pedidoId) {
      return res.status(200).send();
    }

    const pedido =
      await buscarPedidoComItens(pedidoId);

    if (!pedido) {
      console.warn(
        `Pedido ${pedidoId} não encontrado para o pagamento ${dataId}.`
      );

      return res.status(200).send();
    }

    const statusPagamento =
      MAPA_STATUS_PAGAMENTO[
        pagamento.status
      ] || 'pendente';

    if (
      pedido.status_pagamento ===
      statusPagamento
    ) {
      return res.status(200).send();
    }

    await atualizarStatusEFormaPagamento(
      pedidoId,
      statusPagamento,
      pagamento.payment_type_id
    );

    if (
      statusPagamento === 'rejeitado' ||
      statusPagamento === 'cancelado'
    ) {
      await devolverEstoquePedido(
        pedidoId
      );

      await atualizarStatusPedido(
        pedidoId,
        'cancelado'
      );
    }

    console.log(
      `Pedido ${pedidoId} atualizado para pagamento: ${statusPagamento}`
    );

    return res.status(200).send();
  } catch (err) {
    console.error(
      'Erro ao processar webhook do Mercado Pago:',
      err
    );

    return res.status(200).send();
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

    const pedido =
      await atualizarStatusPedido(
        req.params.id,
        status
      );

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
    const pedidos =
      await listarPedidosPorUsuario(
        req.usuario.id
      );

    res.json(pedidos);
  } catch (err) {
    res.status(500).json({
      erro: err.message,
    });
  }
}

async function detalhesPedido(req, res) {
  try {
    const pedido =
      await buscarPedidoComItens(
        req.params.id
      );

    if (!pedido) {
      return res.status(404).json({
        erro: 'Pedido não encontrado.',
      });
    }

    if (
      pedido.usuario_id !==
        req.usuario.id &&
      req.usuario.tipo !== 'admin'
    ) {
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
    const pedidos =
      await listarTodosPedidos();

    res.json(pedidos);
  } catch (err) {
    res.status(500).json({
      erro: err.message,
    });
  }
}

async function cancelarPedidoController(
  req,
  res
) {
  try {
    const pedido =
      await cancelarPedido(
        Number(req.params.id),
        req.usuario.id
      );

    res.json(pedido);
  } catch (err) {
    if (
      err.code === 'ORDER_NOT_FOUND'
    ) {
      return res.status(404).json({
        erro: err.message,
      });
    }

    if (
      err.code === 'ORDER_FORBIDDEN'
    ) {
      return res.status(403).json({
        erro: err.message,
      });
    }

    if (
      err.code ===
      'ORDER_CANNOT_CANCEL'
    ) {
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
  processarPagamento,
  atualizarStatus,
  meusPedidos,
  todosPedidos,
  detalhesPedido,
  cancelarPedido:
    cancelarPedidoController,
  webhook,
};