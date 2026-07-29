const express = require('express');

const router = express.Router({ mergeParams: true });
const { criar, listar } = require('../controllers/variationController');
const { autenticar, apenasAdmin } = require('../middlewares/authMiddleware');

router.post('/', autenticar, apenasAdmin, criar);
router.get('/', listar);

module.exports = router;