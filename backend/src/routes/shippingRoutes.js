const express = require('express');
const router = express.Router();

const { calcular } = require('../controllers/shippingController');

router.post('/calcular', calcular);

module.exports = router;