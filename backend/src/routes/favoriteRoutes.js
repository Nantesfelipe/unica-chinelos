const express = require('express');
const router = express.Router();
const { adicionar, remover, listar } = require('../controllers/favoriteController');
const { autenticar } = require('../middlewares/authMiddleware');

router.post('/', autenticar, adicionar);
router.delete('/:produtoId', autenticar, remover);
router.get('/', autenticar, listar);

module.exports = router;