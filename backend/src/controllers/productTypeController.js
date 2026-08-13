const {
  listarTiposProduto,
  listarTiposComProdutos,
} = require('../models/productTypeModel');

async function listar(req, res) {
  try {
    const tipos = await listarTiposProduto();

    res.json(tipos);
  } catch (err) {
    res.status(500).json({
      erro: err.message,
    });
  }
}

async function listarTiposComProdutosController(req, res) {
  try {
    const tipos = await listarTiposComProdutos();

    res.json(tipos);
  } catch (err) {
    res.status(500).json({
      erro: err.message,
    });
  }
}

module.exports = {
  listar,
  listarTiposComProdutosController,
};