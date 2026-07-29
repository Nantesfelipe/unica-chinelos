const express = require('express');
const router = express.Router();
const { finalizar, atualizarStatus, meusPedidos, detalhesPedido } = require('../controllers/orderController');
const { autenticar, apenasAdmin } = require('../middlewares/authMiddleware');

router.post('/', autenticar, finalizar);
router.get('/', autenticar, meusPedidos);
router.get('/:id', autenticar, detalhesPedido);
router.put('/:id/status', autenticar, apenasAdmin, atualizarStatus);

module.exports = router;