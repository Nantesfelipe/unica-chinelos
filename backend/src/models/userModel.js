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
       created_at
     FROM usuario
     WHERE id = $1`,
    [id]
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
       created_at
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
       u.created_at`,
    [id]
  );

  return result.rows[0];
}

module.exports = {
  criarUsuario,
  buscarPorEmail,
  buscarPorId,
  listarClientes,
  buscarClienteComPedidos,
};