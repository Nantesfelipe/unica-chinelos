const { buscarVariacaoComPreco, criarPedidoComItens } = require('../models/orderModel');

async function finalizar(req, res) {
  try {
    const { itens, formaPagamento } = req.body;

    if (!itens || itens.length === 0) {
      return res.status(400).json({ erro: 'O pedido precisa ter ao menos um item.' });
    }

    const itensComPreco = [];
    let valorTotal = 0;

    for (const item of itens) {
      const variacao = await buscarVariacaoComPreco(item.variacaoId);

      if (!variacao) {
        return res.status(404).json({ erro: `Variação ${item.variacaoId} não encontrada.` });
      }

      if (variacao.estoque < item.quantidade) {
        return res.status(400).json({ erro: `Estoque insuficiente para a variação ${item.variacaoId}.` });
      }

      const preco = parseFloat(variacao.preco);
      itensComPreco.push({ variacaoId: item.variacaoId, quantidade: item.quantidade, preco });
      valorTotal += preco * item.quantidade;
    }

    const pedido = await criarPedidoComItens({
      usuarioId: req.usuario.id,
      formaPagamento,
      itensComPreco,
      valorTotal
    });

    res.status(201).json(pedido);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

module.exports = { finalizar };