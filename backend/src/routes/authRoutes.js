//criando a rota de cadastro de usuario.

const express = require('express'); //importa o framwork usado para criar a API

const router = express.Router();
const { cadastrar } = require('../controllers/authController');

router.post('/cadastro', cadastrar);

module.exports = router;