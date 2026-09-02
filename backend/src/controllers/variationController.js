const {
  criarVariacao,
  listarVariacoesPorProduto,
  adicionarEstoque
} = require('../models/variationModel');

async function criar(req, res) {
  try {
    const { id: produtoId } = req.params;
    const { cor, tamanho, estoque } = req.body;

    const variacao = await criarVariacao(produtoId, {
      cor,
      tamanho,
      estoque
    });

    res.status(201).json(variacao);
  } catch (err) {
    if (err.code === 'INVALID_VARIATION') {
      return res.status(400).json({
        erro: err.message
      });
    }

    if (err.code === 'INVALID_STOCK') {
      return res.status(400).json({
        erro: err.message
      });
    }

    if (err.code === 'DUPLICATE_VARIATION') {
      return res.status(409).json({
        erro: err.message
      });
    }

    console.error(err);

    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}

async function listar(req, res) {
  try {
    const variacoes = await listarVariacoesPorProduto(req.params.id);

    res.json(variacoes);
  } catch (err) {
    console.error(err);

    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}

async function entradaEstoque(req, res) {
  try {
    const { id: variacaoId } = req.params;
    const { quantidade } = req.body;

    const variacao = await adicionarEstoque(
      variacaoId,
      quantidade
    );

    if (!variacao) {
      return res.status(404).json({
        erro: 'Variação não encontrada.'
      });
    }

    res.json(variacao);
  } catch (err) {
    if (err.code === 'INVALID_STOCK_ENTRY') {
      return res.status(400).json({
        erro: err.message
      });
    }

    console.error(err);

    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}

module.exports = {
  criar,
  listar,
  entradaEstoque
};