const {
  criarProduto,
  listarProdutos,
  buscarProdutoPorId,
  atualizarProduto,
  excluirProduto
} = require('../models/productModel');

async function criar(req, res) {
  try {
    const { nome, descricao, preco, categoriaId, destaque, promocao } = req.body;

    if (!nome || !preco || !categoriaId) {
      return res.status(400).json({ erro: 'Nome, preço e categoria são obrigatórios.' });
    }

    const produto = await criarProduto({ nome, descricao, preco, categoriaId, destaque, promocao });
    res.status(201).json(produto);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

async function listar(req, res) {
  try {
    const { busca, categoriaId } = req.query;
    const produtos = await listarProdutos({ busca, categoriaId });
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

async function buscarPorId(req, res) {
  try {
    const produto = await buscarProdutoPorId(req.params.id);
    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado.' });
    }
    res.json(produto);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

async function atualizar(req, res) {
  try {
    const { nome, descricao, preco, categoriaId, destaque, promocao } = req.body;
    const produto = await atualizarProduto(req.params.id, { nome, descricao, preco, categoriaId, destaque, promocao });
    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado.' });
    }
    res.json(produto);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

async function excluir(req, res) {
  try {
    await excluirProduto(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

module.exports = { criar, listar, buscarPorId, atualizar, excluir };