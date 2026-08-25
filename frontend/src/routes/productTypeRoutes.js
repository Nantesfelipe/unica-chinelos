const express = require('express');

const router = express.Router();

const {
  listar,
  listarTiposComProdutosController,
  criar,
  atualizar,
  excluir,
} = require('../controllers/productTypeController');

const {
  autenticar,
  apenasAdmin,
} = require('../middlewares/authMiddleware');

router.get('/', listar);

router.get(
  '/com-produtos',
  listarTiposComProdutosController
);

router.post(
  '/',
  autenticar,
  apenasAdmin,
  criar
);

router.put(
  '/:id',
  autenticar,
  apenasAdmin,
  atualizar
);

router.delete(
  '/:id',
  autenticar,
  apenasAdmin,
  excluir
);

module.exports = router;