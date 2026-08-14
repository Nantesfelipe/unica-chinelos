const {
  buscarVariacaoComPreco,
  criarPedidoComItens,
  atualizarStatusPedido,
  listarPedidosPorUsuario,
  listarTodosPedidos,
  buscarPedidoComItens,
  cancelarPedido,
} = require('../models/orderModel');

async function finalizar(req, res) {
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
        erro: 'O pedido precisa ter ao menos um item.',
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
          erro: 'Cada item deve possuir uma variação válida e uma quantidade maior que zero.',
        });
      }
    }

    const pedido =
      await criarPedidoComItens({
        usuarioId:
          req.usuario.id,
        formaPagamento,
        itens,
      });

    res.status(201).json(
      pedido
    );
  } catch (err) {
    if (
      err.code ===
      'INCOMPLETE_ADDRESS'
    ) {
      return res.status(400).json({
        erro: err.message,
      });
    }

    if (
      err.code ===
      'USER_NOT_FOUND'
    ) {
      return res.status(404).json({
        erro: err.message,
      });
    }

    if (
      err.code ===
      'INSUFFICIENT_STOCK'
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