const express = require('express');
const rateLimit = require('express-rate-limit');

const router = express.Router();
const {
  cadastrar,
  login,
  usuarioAtual,
  solicitarRecuperacaoSenha,
  redefinirSenha,
} = require('../controllers/authController');

const { autenticar } = require('../middlewares/authMiddleware');

const limitadorLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    erro: 'Muitas tentativas. Tente novamente em alguns minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/cadastro', cadastrar);
router.post('/login', limitadorLogin, login);
router.post('/recuperar-senha', limitadorLogin, solicitarRecuperacaoSenha);
router.post('/redefinir-senha', limitadorLogin, redefinirSenha);
router.get('/me', autenticar, usuarioAtual);

module.exports = router;