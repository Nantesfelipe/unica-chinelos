const express = require('express');

const router = express.Router();

const {
  listar,
  listarTiposComProdutosController,
} = require('../controllers/productTypeController');

router.get('/', listar);

router.get(
  '/com-produtos',
  listarTiposComProdutosController
);

module.exports = router;