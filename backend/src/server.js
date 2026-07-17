const express = require('express');
const pool = require('./config/database');

const app = express();
app.use(express.json());

// Rota de teste: confirma que o servidor está de pé
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Rota de teste: confirma que o servidor consegue falar com o banco
app.get('/health/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', db_time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ status: 'erro', error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});