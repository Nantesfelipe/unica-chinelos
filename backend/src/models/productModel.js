const pool = require('../config/database'); //essa linha importa a conexão com o banco para que o arquivo possa executar consultas SQL.

async function criarProduto({ nome, descricao, preco, categoriaId, destaque, promocao }) {
    const result = await pool.query(
        `INSERT INTO produto (nome, descricao, preco, categoria_id, destaque, promocao)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [nome, descricao, preco, categoriaId, destaque || false, promocao || false]
    );
    return result.rows[0];
}

async function listarProdutos({ busca, categoriaId, incluirInativos } = {}) {
  let query = 'SELECT * FROM produto WHERE 1=1';
  const valores = [];

  if (!incluirInativos) {
    query += ' AND ativo = true';
  }

  if (busca) {
    valores.push(`%${busca}%`);
    query += ` AND nome ILIKE $${valores.length}`;
  }

  if (categoriaId) {
    valores.push(categoriaId);
    query += ` AND categoria_id = $${valores.length}`;
  }

  query += ' ORDER BY created_at DESC';

  const result = await pool.query(query, valores);
  return result.rows;
}

async function desativarProduto(id) {
  const result = await pool.query(
    'UPDATE produto SET ativo = false WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
}

async function reativarProduto(id) {
  const result = await pool.query(
    'UPDATE produto SET ativo = true WHERE id = $1 RETURNING *',
    [id]
  );
  return result.rows[0];
}

async function buscarProdutoPorId(id) {
    const result = await pool.query('SELECT * FROM produto WHERE id = $1', [id]);
    return result.rows[0];
}

async function atualizarProduto(id, { nome, descricao, preco, categoriaId, destaque, promocao }) {
    const result = await pool.query(
        `UPDATE produto
        SET nome = $1,
        descricao = $2,
        preco = $3,
        categoria_id = $4,
        destaque = $5,
        promocao = $6
        WHERE id = $7
        RETURNING *`,
        [nome, descricao, preco, categoriaId, destaque, promocao, id]
    );
    return result.rows[0];
}

async function excluirProduto(id) {
    await pool.query('DELETE FROM produto WHERE id = $1', [id]);
}

module.exports = {
  criarProduto,
  listarProdutos,
  buscarProdutoPorId,
  atualizarProduto,
  desativarProduto,
  reativarProduto,
  excluirProduto,
};