const express = require('express');

const router = express.Router();

const {
  listarClientesController,
  buscarClienteController,
} = require('../controllers/userController');

const {
  autenticar,
  apenasAdmin,
} = require('../middlewares/authMiddleware');

router.get(
  '/clientes',
  autenticar,
  apenasAdmin,
  listarClientesController
);

router.get(
  '/clientes/:id',
  autenticar,
  apenasAdmin,
  buscarClienteController
);

module.exports = router;