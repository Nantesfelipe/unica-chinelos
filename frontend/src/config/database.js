//ponte com o db, criando uma Pool de conexões.

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  client_encoding: 'UTF8',
});

pool.on('connect', async (client) => {
    const banco = await client.query(`
        SELECT 
            current_database(),
            current_user,
            current_setting('server_encoding'),
            current_setting('client_encoding');
    `);

    console.log(banco.rows);
});

module.exports = pool;