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

async function criarTipoProduto(nome) {
  const result = await pool.query(
    `INSERT INTO tipo_produto (nome)
     VALUES ($1)
     RETURNING id, nome`,
    [nome]
  );

  return result.rows[0];
}

async function atualizarTipoProduto(id, nome) {
  const result = await pool.query(
    `UPDATE tipo_produto
     SET nome = $1
     WHERE id = $2
     RETURNING id, nome`,
    [nome, id]
  );

  return result.rows[0];
}

async function excluirTipoProduto(id) {
  await pool.query(
    `DELETE FROM tipo_produto
     WHERE id = $1`,
    [id]
  );
}

module.exports = {
  listarTiposProduto,
  listarTiposComProdutos,
  criarTipoProduto,
  atualizarTipoProduto,
  excluirTipoProduto,
};