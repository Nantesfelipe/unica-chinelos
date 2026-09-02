const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const pool = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productTypeRoutes = require('./routes/productTypeRoutes');
const userRoutes = require('./routes/userRoutes');
const cupomRoutes = require('./routes/cupomRoutes');
const shippingRoutes = require('./routes/shippingRoutes');

const { autenticar, apenasAdmin } = require('./middlewares/authMiddleware');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const app = express();

app.use(helmet());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

const origensPermitidas = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
].filter(Boolean);

app.use(
  cors({
    origin: origensPermitidas,
  })
);

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/orders', orderRoutes);
app.use('/categories', categoryRoutes);
app.use('/product-types', productTypeRoutes);
app.use('/users', userRoutes);
app.use('/coupons', cupomRoutes);
app.use('/shipping', shippingRoutes);

if (process.env.NODE_ENV !== 'production') {
  app.use(
    '/api/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/health/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');

    res.json({
      status: 'ok',
      db_time: result.rows[0].now,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({ status: 'erro' });
  }
});

app.get('/perfil', autenticar, (req, res) => {
  res.json({
    mensagem: 'Você está autenticado!',
    usuario: req.usuario,
  });
});

app.get(
  '/admin/teste',
  autenticar,
  apenasAdmin,
  (req, res) => {
    res.json({
      mensagem: 'Você é admin!',
      usuario: req.usuario,
    });
  }
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});