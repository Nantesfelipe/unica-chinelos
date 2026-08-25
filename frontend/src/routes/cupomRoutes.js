const express = require('express');
const router = express.Router();

const { criar, listar, atualizar, excluir, validar } = require('../controllers/cupomController');
const { autenticar, apenasAdmin } = require('../middlewares/authMiddleware');

router.post('/', autenticar, apenasAdmin, criar);
router.get('/', autenticar, apenasAdmin, listar);
router.patch('/:id', autenticar, apenasAdmin, atualizar);
router.delete('/:id', autenticar, apenasAdmin, excluir);
router.post('/validar', autenticar, validar);

module.exports = router;