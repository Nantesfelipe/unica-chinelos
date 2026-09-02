const {
  listarTiposProduto,
  listarTiposComProdutos,
  criarTipoProduto,
  atualizarTipoProduto,
  excluirTipoProduto,
} = require('../models/productTypeModel');

async function listar(req, res) {
  try {
    const tipos = await listarTiposProduto();

    res.json(tipos);
  } catch (err) {
    console.error(err);

    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}

async function listarTiposComProdutosController(req, res) {
  try {
    const tipos = await listarTiposComProdutos();

    res.json(tipos);
  } catch (err) {
    console.error(err);

    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}

async function criar(req, res) {
  try {
    const nome = String(req.body.nome || '').trim();

    if (!nome) {
      return res.status(400).json({
        erro: 'Nome do tipo de produto é obrigatório.',
      });
    }

    const tipo = await criarTipoProduto(nome);

    res.status(201).json(tipo);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({
        erro: 'Já existe um tipo de produto com esse nome.',
      });
    }

    console.error(err);

    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}

async function atualizar(req, res) {
  try {
    const id = Number(req.params.id);
    const nome = String(req.body.nome || '').trim();

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        erro: 'ID inválido.',
      });
    }

    if (!nome) {
      return res.status(400).json({
        erro: 'Nome do tipo de produto é obrigatório.',
      });
    }

    const tipo = await atualizarTipoProduto(id, nome);

    if (!tipo) {
      return res.status(404).json({
        erro: 'Tipo de produto não encontrado.',
      });
    }

    res.json(tipo);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({
        erro: 'Já existe um tipo de produto com esse nome.',
      });
    }

    console.error(err);

    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}

async function excluir(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        erro: 'ID inválido.',
      });
    }

    await excluirTipoProduto(id);

    res.status(204).send();
  } catch (err) {
    if (err.code === '23503') {
      return res.status(409).json({
        erro:
          'Não é possível excluir este tipo de produto porque existem produtos vinculados a ele.',
      });
    }

    console.error(err);

    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}

module.exports = {
  listar,
  listarTiposComProdutosController,
  criar,
  atualizar,
  excluir,
};