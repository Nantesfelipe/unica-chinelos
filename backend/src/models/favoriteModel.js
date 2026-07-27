const pool = require('../config/database');

async function adicionarFavorito(usuarioId, produtoId) {
  const result = await pool.query(
    `INSERT INTO favorito (usuario_id, produto_id)
     VALUES ($1, $2)
     ON CONFLICT (usuario_id, produto_id) DO NOTHING
     RETURNING *`,
    [usuarioId, produtoId]
  );
  return result.rows[0];
}

async function removerFavorito(usuarioId, produtoId) {
  await pool.query(
    'DELETE FROM favorito WHERE usuario_id = $1 AND produto_id = $2',
    [usuarioId, produtoId]
  );
}

async function listarFavoritosPorUsuario(usuarioId) {
  const result = await pool.query(
    `SELECT p.* FROM favorito f
     JOIN produto p ON p.id = f.produto_id
     WHERE f.usuario_id = $1`,
    [usuarioId]
  );
  return result.rows;
}

module.exports = { adicionarFavorito, removerFavorito, listarFavoritosPorUsuario };