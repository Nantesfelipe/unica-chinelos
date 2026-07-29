const { criarVariacao, listarVariacoesPorProduto } = require('../models/variationModel');

async function criar(req, res) {
  try {
    const { id: produtoId } = req.params;
    const { cor, tamanho, estoque } = req.body;

    const variacao = await criarVariacao(produtoId, { cor, tamanho, estoque });
    res.status(201).json(variacao);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

async function listar(req, res) {
  try {
    const variacoes = await listarVariacoesPorProduto(req.params.id);
    res.json(variacoes);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

module.exports = { criar, listar };