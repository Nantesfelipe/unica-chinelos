const pool = require('../config/database');

async function criarUsuario({
  nome,
  email,
  senhaHash,
}) {
  const result = await pool.query(
    `INSERT INTO usuario (
      nome,
      email,
      senha_hash,
      tipo
    )
    VALUES ($1, $2, $3, 'cliente')
    RETURNING
      id,
      nome,
      email,
      tipo,
      created_at`,
    [
      nome,
      email,
      senhaHash,
    ]
  );

  return result.rows[0];
}

async function buscarPorEmail(email) {
  const result = await pool.query(
    'SELECT * FROM usuario WHERE email = $1',
    [email]
  );

  return result.rows[0];
}

async function buscarPorId(id) {
  const result = await pool.query(
    `SELECT
       id,
       nome,
       email,
       tipo,
       created_at,
       telefone,
       cpf,
       cep,
       logradouro,
       numero,
       complemento,
       bairro,
       cidade,
       estado
     FROM usuario
     WHERE id = $1`,
    [id]
  );

  return result.rows[0];
}

async function atualizarPerfil(
  id,
  {
    nome,
    telefone,
    cpf,
    cep,
    logradouro,
    numero,
    complemento,
    bairro,
    cidade,
    estado,
  }
) {
  const result = await pool.query(
    `UPDATE usuario
     SET
       nome = $1,
       telefone = $2,
       cpf = $3,
       cep = $4,
       logradouro = $5,
       numero = $6,
       complemento = $7,
       bairro = $8,
       cidade = $9,
       estado = $10
     WHERE id = $11
     RETURNING
       id,
       nome,
       email,
       tipo,
       created_at,
       telefone,
       cpf,
       cep,
       logradouro,
       numero,
       complemento,
       bairro,
       cidade,
       estado`,
    [
      nome,
      telefone,
      cpf,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      id,
    ]
  );

  return result.rows[0];
}

async function listarClientes() {
  const result = await pool.query(
    `SELECT
       id,
       nome,
       email,
       tipo,
       created_at,
       telefone,
       cpf,
       cep,
       logradouro,
       numero,
       complemento,
       bairro,
       cidade,
       estado
     FROM usuario
     WHERE tipo = 'cliente'
     ORDER BY created_at DESC`
  );

  return result.rows;
}

async function buscarClienteComPedidos(id) {
  const result = await pool.query(
    `SELECT
       u.id,
       u.nome,
       u.email,
       u.created_at,
       u.telefone,
       u.cpf,
       u.cep,
       u.logradouro,
       u.numero,
       u.complemento,
       u.bairro,
       u.cidade,
       u.estado,

       COUNT(p.id)::integer AS total_pedidos,

       COALESCE(
         SUM(
           CASE
             WHEN p.status <> 'cancelado'
             THEN p.valor_total
             ELSE 0
           END
         ),
         0
       ) AS total_compras,

       COALESCE(
         json_agg(
           json_build_object(
             'id', p.id,
             'status', p.status,
             'valor_total', p.valor_total,
             'created_at', p.created_at,
             'forma_pagamento', p.forma_pagamento
           )
           ORDER BY p.created_at DESC
         ) FILTER (WHERE p.id IS NOT NULL),
         '[]'::json
       ) AS pedidos

     FROM usuario u

     LEFT JOIN pedido p
       ON p.usuario_id = u.id

     WHERE u.id = $1
       AND u.tipo = 'cliente'

     GROUP BY
       u.id,
       u.nome,
       u.email,
       u.created_at,
       u.telefone,
       u.cpf,
       u.cep,
       u.logradouro,
       u.numero,
       u.complemento,
       u.bairro,
       u.cidade,
       u.estado`,
    [id]
  );

  return result.rows[0];
}

async function criarTokenRecuperacao(
  email,
  token,
  expiraEm
) {
  const result = await pool.query(
    `UPDATE usuario
     SET
       reset_token = $1,
       reset_token_expires_at = $2
     WHERE email = $3
     RETURNING id, email`,
    [
      token,
      expiraEm,
      email,
    ]
  );

  return result.rows[0];
}

async function buscarPorTokenRecuperacao(
  token
) {
  const result = await pool.query(
    `SELECT *
     FROM usuario
     WHERE reset_token = $1
       AND reset_token_expires_at > NOW()`,
    [token]
  );

  return result.rows[0];
}

async function atualizarSenhaPorToken(
  id,
  senhaHash
) {
  const result = await pool.query(
    `UPDATE usuario
     SET
       senha_hash = $1,
       reset_token = NULL,
       reset_token_expires_at = NULL
     WHERE id = $2
     RETURNING
       id,
       email`,
    [
      senhaHash,
      id,
    ]
  );

  return result.rows[0];
}
module.exports = {
  criarUsuario,
  buscarPorEmail,
  buscarPorId,
  atualizarPerfil,
  listarClientes,
  buscarClienteComPedidos,
  criarTokenRecuperacao,
  buscarPorTokenRecuperacao,
  atualizarSenhaPorToken,
};