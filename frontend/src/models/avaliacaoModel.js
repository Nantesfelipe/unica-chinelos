const pool = require('../config/database');

async function usuarioComprouProduto(usuarioId, produtoId) {
  const result = await pool.query(
    `SELECT 1
     FROM pedido p
     JOIN item_pedido ip ON ip.pedido_id = p.id
     JOIN variacao v ON v.id = ip.variacao_id
     WHERE p.usuario_id = $1
       AND v.produto_id = $2
       AND p.status = 'entregue'
     LIMIT 1`,
    [usuarioId, produtoId]
  );

  return result.rowCount > 0;
}

async function criarAvaliacao({ produtoId, usuarioId, nota, comentario }) {
  const result = await pool.query(
    `INSERT INTO avaliacao (produto_id, usuario_id, nota, comentario)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [produtoId, usuarioId, nota, comentario || null]
  );

  return result.rows[0];
}

async function listarAvaliacoesPorProduto(produtoId) {
  const result = await pool.query(
    `SELECT a.*, u.nome AS usuario_nome
     FROM avaliacao a
     JOIN usuario u ON u.id = a.usuario_id
     WHERE a.produto_id = $1
     ORDER BY a.created_at DESC`,
    [produtoId]
  );

  return result.rows;
}

async function buscarMediaProduto(produtoId) {
  const result = await pool.query(
    `SELECT
       COUNT(*)::int AS total,
       COALESCE(AVG(nota), 0)::float AS media
     FROM avaliacao
     WHERE produto_id = $1`,
    [produtoId]
  );

  return result.rows[0];
}

async function buscarAvaliacaoPorId(id) {
  const result = await pool.query(
    'SELECT * FROM avaliacao WHERE id = $1',
    [id]
  );

  return result.rows[0];
}

async function excluirAvaliacao(id) {
  const result = await pool.query(
    'DELETE FROM avaliacao WHERE id = $1 RETURNING id',
    [id]
  );

  return result.rows[0];
}

module.exports = {
  usuarioComprouProduto,
  criarAvaliacao,
  listarAvaliacoesPorProduto,
  buscarMediaProduto,
  buscarAvaliacaoPorId,
  excluirAvaliacao,
};