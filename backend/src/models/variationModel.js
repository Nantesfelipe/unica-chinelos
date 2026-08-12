const pool = require('../config/database');

async function criarVariacao(produtoId, { cor, tamanho, estoque }) {
  const estoqueInicial = Number(estoque) || 0;

  if (!tamanho && !cor) {
    const erro = new Error('Informe pelo menos o tamanho ou a cor.');
    erro.code = 'INVALID_VARIATION';
    throw erro;
  }

  if (estoqueInicial < 0) {
    const erro = new Error('O estoque não pode ser negativo.');
    erro.code = 'INVALID_STOCK';
    throw erro;
  }

  const existente = await pool.query(
    `SELECT id
     FROM variacao
     WHERE produto_id = $1
       AND COALESCE(cor, '') = COALESCE($2, '')
       AND COALESCE(tamanho, '') = COALESCE($3, '')`,
    [produtoId, cor || null, tamanho || null]
  );

  if (existente.rows.length > 0) {
    const erro = new Error(
      'Já existe uma variação com esse tamanho e cor para este produto.'
    );
    erro.code = 'DUPLICATE_VARIATION';
    throw erro;
  }

  const result = await pool.query(
    `INSERT INTO variacao (
      produto_id,
      cor,
      tamanho,
      estoque
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
    [
      produtoId,
      cor?.trim() || null,
      tamanho?.trim() || null,
      estoqueInicial
    ]
  );

  return result.rows[0];
}

async function listarVariacoesPorProduto(produtoId) {
  const result = await pool.query(
    `SELECT *
     FROM variacao
     WHERE produto_id = $1
     ORDER BY
       CASE
         WHEN tamanho IS NULL THEN 1
         ELSE 0
       END,
       tamanho,
       cor`,
    [produtoId]
  );

  return result.rows;
}

async function adicionarEstoque(variacaoId, quantidade) {
  const quantidadeEntrada = Number(quantidade);

  if (!Number.isInteger(quantidadeEntrada) || quantidadeEntrada <= 0) {
    const erro = new Error(
      'A quantidade de entrada deve ser um número inteiro maior que zero.'
    );
    erro.code = 'INVALID_STOCK_ENTRY';
    throw erro;
  }

  const result = await pool.query(
    `UPDATE variacao
     SET estoque = estoque + $1
     WHERE id = $2
     RETURNING *`,
    [quantidadeEntrada, variacaoId]
  );

  return result.rows[0];
}

module.exports = {
  criarVariacao,
  listarVariacoesPorProduto,
  adicionarEstoque
};