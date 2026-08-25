const pool = require('../config/database');

async function criarCategoria(nome) {
  const result = await pool.query(
    'INSERT INTO categoria (nome) VALUES ($1) RETURNING *',
    [nome]
  );
  return result.rows[0];
}

async function listarCategorias() {
  const result = await pool.query('SELECT * FROM categoria ORDER BY nome');
  return result.rows;
}

async function excluirCategoria(id) {
  await pool.query('DELETE FROM categoria WHERE id = $1', [id]);
}

module.exports = { criarCategoria, listarCategorias, excluirCategoria };