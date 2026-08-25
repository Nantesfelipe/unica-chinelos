
const {
  criarPedidoComItens,
  devolverEstoquePedido,
  atualizarMercadoPagoId,
  atualizarStatusPedido,
  listarPedidosPorUsuario,
  listarTodosPedidos,
  buscarPedidoComItens,
  cancelarPedido,
} = require('../models/orderModel');
const {
  MercadoPagoConfig,
  Preference,
} = require('mercadopago');

const mercadoPagoClient =
  new MercadoPagoConfig({
    accessToken:
      process.env.MERCADO_PAGO_ACCESS_TOKEN,
  });

const preferenceClient =
  new Preference(
    mercadoPagoClient
  );

async function finalizar(req, res) {
  let pedidoCriado = null;

  try {
    const {
      itens,
      formaPagamento,
    } = req.body;

    if (
      !Array.isArray(itens) ||
      itens.length === 0
    ) {
      return res.status(400).json({
        erro:
          'O pedido precisa ter ao menos um item.',
      });
    }

    for (const item of itens) {
      if (
        !Number.isInteger(
          Number(item.variacaoId)
        ) ||
        !Number.isInteger(
          Number(item.quantidade)
        ) ||
        Number(item.quantidade) <= 0
      ) {
        return res.status(400).json({
          erro:
            'Cada item deve possuir uma variação válida e uma quantidade maior que zero.',
        });
      }
    }

    /*
     * 1. Cria o pedido e reserva o estoque.
     */
    pedidoCriado =
      await criarPedidoComItens({
        usuarioId:
          req.usuario.id,
        formaPagamento,
        itens,
      });

    /*
     * 2. Busca os detalhes completos
     * para montar a preferência.
     */
    const pedidoDetalhado =
      await buscarPedidoComItens(
        pedidoCriado.id
      );

    if (!pedidoDetalhado) {
      throw new Error(
        'Não foi possível recuperar o pedido criado.'
      );
    }

    /*
     * 3. Monta os itens da preferência.
     */
    const itensPreferencia =
      (pedidoDetalhado.itens || []).map(
        (item) => ({
          id: String(
            item.variacao_id
          ),

          title:
            item.produto,

          quantity:
            Number(
              item.quantidade
            ),

          unit_price:
            Number(
              item.preco_unitario
            ),

          currency_id:
            'BRL',
        })
      );

    /*
     * 4. Cria a preferência no
     * Mercado Pago.
     */
    const preference =
      await preferenceClient.create({
        body: {
          external_reference:
            String(
              pedidoCriado.id
            ),

          payer: {
            name:
              req.usuario.nome,

            email:
              req.usuario.email,
          },

          items:
            itensPreferencia,

          /*
           * Retornos serão configurados
           * definitivamente no passo seguinte.
           */
          
        },
      });

    /*
     * 5. Salva o ID da preferência
     * no pedido.
     */
    const pedidoAtualizado =
      await atualizarMercadoPagoId(
        pedidoCriado.id,
        preference.id
      );

    if (!pedidoAtualizado) {
      throw new Error(
        'Pedido criado, mas não foi possível salvar o ID do Mercado Pago.'
      );
    }

    /*
     * 6. Retorna os dados necessários
     * para o frontend.
     */
    res.status(201).json({
      pedido:
        pedidoAtualizado,

      preferenceId:
        preference.id,

      initPoint:
        preference.init_point,
    });
  } catch (err) {
    console.error(
      'Erro ao criar pedido/pagamento:',
      err
    );

    /*
     * Se o pedido já foi criado e a
     * preferência falhou, devolvemos
     * o estoque reservado.
     */
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

    res.status(500).json({
      erro:
        'Não foi possível iniciar o pagamento.',
    });
  }
}

const STATUS_VALIDOS = [
  'recebido',
  'em_separacao',
  'enviado',
  'entregue',
  'cancelado',
];

async function atualizarStatus(
  req,
  res
) {
  try {
    const { status } =
      req.body;

    if (
      !STATUS_VALIDOS.includes(
        status
      )
    ) {
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

async function meusPedidos(
  req,
  res
) {
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

async function detalhesPedido(
  req,
  res
) {
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
      req.usuario.tipo !==
        'admin'
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

async function todosPedidos(
  req,
  res
) {
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
      err.code ===
      'ORDER_NOT_FOUND'
    ) {
      return res.status(404).json({
        erro: err.message,
      });
    }

    if (
      err.code ===
      'ORDER_FORBIDDEN'
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
  atualizarStatus,
  meusPedidos,
  todosPedidos,
  detalhesPedido,
  cancelarPedido:
    cancelarPedidoController,
};