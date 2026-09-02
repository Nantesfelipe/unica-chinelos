const { adicionarFavorito, removerFavorito, listarFavoritosPorUsuario } = require('../models/favoriteModel');

async function adicionar(req, res) {
  try {
    const favorito = await adicionarFavorito(req.usuario.id, req.body.produtoId);
    res.status(201).json(favorito);
  } catch (err) {
    console.error(err);

    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}

async function remover(req, res) {
  try {
    await removerFavorito(req.usuario.id, req.params.produtoId);
    res.status(204).send();
  } catch (err) {
    console.error(err);

    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}

async function listar(req, res) {
  try {
    const favoritos = await listarFavoritosPorUsuario(req.usuario.id);
    res.json(favoritos);
  } catch (err) {
    console.error(err);

    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}

module.exports = { adicionar, remover, listar };