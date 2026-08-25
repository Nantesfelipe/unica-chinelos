
const {
  criarProduto,
  listarProdutos,
  buscarProdutoPorId,
  atualizarProduto,
  desativarProduto,
  reativarProduto,
  excluirProduto,
} = require('../models/productModel');
async function criar(req, res) {
  try {
    const {
      nome,
      descricao,
      preco,
      categoriaId,
      tipoProdutoId,
      destaque,
      promocao,
    } = req.body;

    if (!nome || !preco || !categoriaId || !tipoProdutoId) {
      return res.status(400).json({ erro: 'Nome, preço e categoria são obrigatórios.' });
    }

    const produto = await criarProduto({
      nome,
      descricao,
      preco,
      categoriaId,
      tipoProdutoId,
      destaque,
      promocao,
    });
    res.status(201).json(produto);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

async function listar(req, res) {
  try {
    const { busca, categoriaId,tipoProdutoId ,incluirInativos } = req.query;
    const produtos = await listarProdutos({
      busca,
      categoriaId,
      tipoProdutoId,
      incluirInativos: incluirInativos === 'true',
    });
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
    const {
      nome,
      descricao,
      preco,
      categoriaId,
      tipoProdutoId,
      destaque,
      promocao,
    } = req.body;
    const produto = await atualizarProduto(
      req.params.id,
      {
        nome,
        descricao,
        preco,
        categoriaId,
        tipoProdutoId,
        destaque,
        promocao,
      }
    );
    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado.' });
    }
    res.json(produto);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

async function desativar(req, res) {
  try {
    const produto = await desativarProduto(req.params.id);
    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado.' });
    }
    res.json(produto);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

async function reativar(req, res) {
  try {
    const produto = await reativarProduto(req.params.id);
    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado.' });
    }
    res.json(produto);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
async function excluirDefinitivo(req, res) {
  try {
    await excluirProduto(req.params.id);
    res.status(204).send();
  } catch (err) {
    if (err.code === '23503') {
      return res.status(409).json({
        erro: 'Não é possível excluir definitivamente: este produto possui pedidos ou favoritos vinculados. Use "Desativar" para removê-lo do catálogo.',
      });
    }
    res.status(500).json({ erro: err.message });
  }


}
module.exports = { criar, listar, buscarPorId, atualizar, desativar, reativar, excluirDefinitivo };