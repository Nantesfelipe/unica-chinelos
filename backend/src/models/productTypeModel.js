const pool = require('../config/database');

async function listarTiposProduto() {
  const result = await pool.query(
    `SELECT id, nome
     FROM tipo_produto
     ORDER BY nome`
  );

  return result.rows;
}

module.exports = {
  listarTiposProduto,
};