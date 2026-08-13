const pool = require('../config/database');

async function criarProduto({
  nome,
  descricao,
  preco,
  categoriaId,
  tipoProdutoId,
  destaque,
  promocao,
}) {
  const result = await pool.query(
    `INSERT INTO produto (
      nome,
      descricao,
      preco,
      categoria_id,
      tipo_produto_id,
      destaque,
      promocao
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      nome,
      descricao,
      preco,
      categoriaId,
      tipoProdutoId,
      destaque || false,
      promocao || false,
    ]
  );

  return result.rows[0];
}

async function listarProdutos({ busca, categoriaId, tipoProdutoId, incluirInativos } = {}) {
  let query = `
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
    FROM produto p
    WHERE 1=1
  `;

  const valores = [];

  if (!incluirInativos) {
    query += ' AND p.ativo = true';
  }

  if (busca) {
    valores.push(`%${busca}%`);
    query += ` AND p.nome ILIKE $${valores.length}`;
  }

  if (categoriaId) {
    valores.push(categoriaId);
    query += ` AND p.categoria_id = $${valores.length}`;
  }

  if (tipoProdutoId) {
  valores.push(tipoProdutoId);

  query += `
    AND p.tipo_produto_id = $${valores.length}
  `;
}

  query += ' ORDER BY p.created_at DESC';

  const result = await pool.query(query, valores);

  return result.rows;
}

async function buscarProdutoPorId(id) {
  const result = await pool.query(
    `
      SELECT
        p.*,
        tp.nome AS tipo_produto_nome,
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
      FROM produto p
      LEFT JOIN tipo_produto tp
        ON tp.id = p.tipo_produto_id
      WHERE p.id = $1
    `,
    [id]
  );

  return result.rows[0];
}

async function atualizarProduto(
  id,
  {
    nome,
    descricao,
    preco,
    categoriaId,
    tipoProdutoId,
    destaque,
    promocao,
  }
) {
  const result = await pool.query(
    `UPDATE produto
     SET
       nome = $1,
       descricao = $2,
       preco = $3,
       categoria_id = $4,
       tipo_produto_id = $5,
       destaque = $6,
       promocao = $7
     WHERE id = $8
     RETURNING *`,
    [
      nome,
      descricao,
      preco,
      categoriaId,
      tipoProdutoId,
      destaque,
      promocao,
      id,
    ]
  );

  return result.rows[0];
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
    `UPDATE produto
     SET ativo = true
     WHERE id = $1
     RETURNING *`,
    [id]
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
