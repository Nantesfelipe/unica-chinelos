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
    console.error(err);

    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}

async function listar(req, res) {
  try {
    const categorias = await listarCategorias();
    res.json(categorias);
  } catch (err) {
    console.error(err);

    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}

async function excluir(req, res) {
  try {
    await excluirCategoria(req.params.id);
    res.status(204).send();
  } catch (err) {
    if (err.code === '23503') {
      return res.status(409).json({
        erro: 'Não é possível excluir esta categoria porque existem produtos vinculados a ela.',
      });
    }
    console.error(err);

    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}

module.exports = { criar, listar, excluir };