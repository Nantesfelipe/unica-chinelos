const express = require('express');
const router = express.Router();
const { criar, listar, excluir } = require('../controllers/categoryController');
const { autenticar, apenasAdmin } = require('../middlewares/authMiddleware');

router.get('/', listar);
router.post('/', autenticar, apenasAdmin, criar);
router.delete('/:id', autenticar, apenasAdmin, excluir);

module.exports = router;