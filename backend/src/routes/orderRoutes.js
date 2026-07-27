const express = require('express');
const router = express.Router();
const { finalizar } = require('../controllers/orderController');
const { autenticar } = require('../middlewares/authMiddleware');

router.post('/', autenticar, finalizar);

module.exports = router;