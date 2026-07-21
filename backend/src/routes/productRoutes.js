const express = require('express');
const router = express.Router();
const { criar, listar, buscarPorId, atualizar, excluir } = require('../controllers/produtoController');
const { autenticar, apenasAdmin } = require('../middlewares/authMiddleware');

// Rotas públicas (qualquer cliente pode ver produtos)
router.get('/', listar);
router.get('/:id', buscarPorId);

// Rotas protegidas (só admin)
router.post('/', autenticar, apenasAdmin, criar);
router.put('/:id', autenticar, apenasAdmin, atualizar);
router.delete('/:id', autenticar, apenasAdmin, excluir);

module.exports = router;