const { criarCategoria, listarCategorias, excluirCategoria } = require('../models/categoryModel');

async function criar(req, res) {
  try {
    const { nome } = req.body;
    if (!nome) {
      return res.status(400).json({ erro: 'Nome é obrigatório.' });
    }
    const categoria = await criarCategoria(nome);
    res.status(201).json(categoria);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

async function listar(req, res) {
  try {
    const categorias = await listarCategorias();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

async function excluir(req, res) {
  try {
    await excluirCategoria(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

module.exports = { criar, listar, excluir };