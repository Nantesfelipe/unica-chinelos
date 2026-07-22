const productImageRoutes = require('./productImageRoutes');
const express = require('express');
const router = express.Router();
const { criar, listar, buscarPorId, atualizar, excluir } = require('../controllers/productController');
const { autenticar, apenasAdmin } = require('../middlewares/authMiddleware');

// Rotas públicas (qualquer cliente pode ver produtos)
router.get('/', listar);
router.get('/:id', buscarPorId);

// Rotas protegidas (só admin)
router.post('/', autenticar, apenasAdmin, criar);
router.put('/:id', autenticar, apenasAdmin, atualizar);
router.delete('/:id', autenticar, apenasAdmin, excluir);

router.use('/:id/images', productImageRoutes);
module.exports = router;