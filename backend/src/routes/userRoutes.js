const express = require('express');

const router = express.Router();

const {
  listarClientesController,
  buscarClienteController,
  atualizarMeuPerfil,
  meuPerfil,
} = require('../controllers/userController');

const {
  autenticar,
  apenasAdmin,
} = require('../middlewares/authMiddleware');

/*
 * Perfil do usuário autenticado
 */

router.get('/me', autenticar, meuPerfil);
router.put('/me', autenticar, atualizarMeuPerfil);

/*
 * Clientes — administrador
 */

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