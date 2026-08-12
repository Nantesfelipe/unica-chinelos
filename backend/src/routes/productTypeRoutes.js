const express = require('express');

const router = express.Router();

const {
  listar,
} = require('../controllers/productTypeController');

router.get('/', listar);

module.exports = router;