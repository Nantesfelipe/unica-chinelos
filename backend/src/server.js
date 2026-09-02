const express = require('express');
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

const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const app = express();

/*
 * LOG TEMPORÁRIO DAS REQUISIÇÕES
 * Mostra método e URL de cada requisição recebida pelo backend.
 */
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

/*
 * CORS
 */
app.use(cors());

/*
 * Permite receber JSON no body das requisições.
 */
app.use(express.json());

/*
 * ROTAS
 */
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/orders', orderRoutes);
app.use('/categories', categoryRoutes);
app.use('/product-types', productTypeRoutes);
app.use('/users', userRoutes);
app.use('/coupons', cupomRoutes);
app.use('/shipping', shippingRoutes);

/*
 * SWAGGER
 */
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

/*
 * HEALTH CHECK
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
  });
});

/*
 * HEALTH CHECK DO BANCO
 */
app.get('/health/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');

    res.json({
      status: 'ok',
      db_time: result.rows[0].now,
    });
  } catch (err) {
    res.status(500).json({
      status: 'erro',
      error: err.message,
    });
  }
});

/*
 * ROTA DE TESTE DE AUTENTICAÇÃO
 */
app.get('/perfil', autenticar, (req, res) => {
  res.json({
    mensagem: 'Você está autenticado!',
    usuario: req.usuario,
  });
});

/*
 * ROTA DE TESTE DE ADMIN
 */
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

/*
 * SERVIDOR
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});