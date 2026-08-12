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
    `
      SELECT
        p.*,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', pi.id,
                'produto_id', pi.produto_id,
                'url', pi.url,
                'ordem', pi.ordem
              )
              ORDER BY pi.ordem
            )
            FROM produto_imagem pi
            WHERE pi.produto_id = p.id
          ),
          '[]'::json
        ) AS imagens
      FROM favorito f
      JOIN produto p
        ON p.id = f.produto_id
      WHERE f.usuario_id = $1
    `,
    [usuarioId]
  );

  return result.rows;
}

module.exports = { adicionarFavorito, removerFavorito, listarFavoritosPorUsuario };