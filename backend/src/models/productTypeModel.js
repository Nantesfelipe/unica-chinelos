const pool = require('../config/database');

async function listarTiposProduto() {
  const result = await pool.query(
    `SELECT id, nome
     FROM tipo_produto
     ORDER BY nome`
  );

  return result.rows;
}

async function listarTiposComProdutos() {
  const result = await pool.query(`
    SELECT DISTINCT
      tp.id,
      tp.nome
    FROM tipo_produto tp
    JOIN produto p
      ON p.tipo_produto_id = tp.id
    WHERE p.ativo = true
    ORDER BY tp.nome;
  `);

  return result.rows;
}
module.exports = {
  listarTiposProduto,
  listarTiposComProdutos,
};