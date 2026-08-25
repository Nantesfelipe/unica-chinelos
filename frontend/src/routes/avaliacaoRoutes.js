const express = require('express');
const router = express.Router({ mergeParams: true });

const { criar, listar, excluir } = require('../controllers/avaliacaoController');
const { autenticar } = require('../middlewares/authMiddleware');

router.get('/', listar);
router.post('/', autenticar, criar);
router.delete('/:avaliacaoId', autenticar, excluir);

module.exports = router;