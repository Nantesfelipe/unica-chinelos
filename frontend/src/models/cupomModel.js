const pool = require('../config/database');

async function criarCupom({
  codigo,
  tipoDesconto,
  valorDesconto,
  dataValidade,
}) {
  const result = await pool.query(
    `INSERT INTO cupom (
      codigo,
      tipo_desconto,
      valor,
      validade
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
    [
      codigo.trim().toUpperCase(),
      tipoDesconto,
      valorDesconto,
      dataValidade || null,
    ]
  );

  return result.rows[0];
}

async function listarCupons() {
  const result = await pool.query(
    `SELECT *
     FROM cupom
     ORDER BY id DESC`
  );

  return result.rows;
}

async function buscarCupomPorCodigo(codigo) {
  const result = await pool.query(
    `SELECT *
     FROM cupom
     WHERE codigo = $1`,
    [
      codigo.trim().toUpperCase(),
    ]
  );

  return result.rows[0];
}

async function atualizarCupom(
  id,
  { ativo }
) {
  const result = await pool.query(
    `UPDATE cupom
     SET ativo = $1
     WHERE id = $2
     RETURNING *`,
    [
      ativo,
      id,
    ]
  );

  return result.rows[0];
}

async function excluirCupom(id) {
  const result = await pool.query(
    `DELETE FROM cupom
     WHERE id = $1
     RETURNING id`,
    [id]
  );

  return result.rows[0];
}

module.exports = {
  criarCupom,
  listarCupons,
  buscarCupomPorCodigo,
  atualizarCupom,
  excluirCupom,
};