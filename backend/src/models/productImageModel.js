const pool = require('../config/database');

async function adicionarImagem(produtoId, url, ordem) {
  const result = await pool.query(
    'INSERT INTO produto_imagem (produto_id, url, ordem) VALUES ($1, $2, $3) RETURNING *',
    [produtoId, url, ordem]
  );
  return result.rows[0];
}

async function listarImagensPorProduto(produtoId) {
  const result = await pool.query(
    'SELECT * FROM produto_imagem WHERE produto_id = $1 ORDER BY ordem',
    [produtoId]
  );
  return result.rows;
}

module.exports = { adicionarImagem, listarImagensPorProduto };
