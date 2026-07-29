const pool = require('../config/database');

async function criarVariacao(produtoId, { cor, tamanho, estoque }) {
  const result = await pool.query(
    `INSERT INTO variacao (produto_id, cor, tamanho, estoque)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [produtoId, cor, tamanho, estoque || 0]
  );
  return result.rows[0];
}

async function listarVariacoesPorProduto(produtoId) {
  const result = await pool.query(
    'SELECT * FROM variacao WHERE produto_id = $1',
    [produtoId]
  );
  return result.rows;
}

module.exports = { criarVariacao, listarVariacoesPorProduto };