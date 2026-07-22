//esse arquivo concentra as queries SQL relacionadas a tabela

const pool = require('../config/database');

async function criarUsuario({ nome, email, senhaHash }) {

  const result = await pool.query( //.query executa uma funcao SQL
    `INSERT INTO usuario (nome, email, senha_hash, tipo) 
     VALUES ($1, $2, $3, 'cliente')
     RETURNING id, nome, email, tipo, created_at`,
    [nome, email, senhaHash]
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

module.exports = { criarUsuario, buscarPorEmail }; // exporta as funcoes para q outros arquivos consigam usa-las

