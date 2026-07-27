const express = require('express');
const pool = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const { autenticar, apenasAdmin } = require('./middlewares/authMiddleware');
const productRoutes = require('./routes/productRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/orders', orderRoutes);

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

app.get('/perfil', autenticar, (req, res) => {
  res.json({ mensagem: 'Você está autenticado!', usuario: req.usuario });
});

app.get('/admin/teste', autenticar, apenasAdmin, (req, res) => {
  res.json({ mensagem: 'Você é admin!', usuario: req.usuario });
});






const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});