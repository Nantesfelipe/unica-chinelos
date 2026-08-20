//criando a rota de cadastro de usuario.

const express = require('express');

const router = express.Router();
const {
  cadastrar,
  login,
  usuarioAtual,
  solicitarRecuperacaoSenha,
  redefinirSenha,
} = require('../controllers/authController');

const {
  autenticar
} = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /auth/cadastro:
 *   post:
 *     tags:
 *       - Autenticação
 *     summary: Cadastra um novo usuário.
 *     description: Cria uma nova conta utilizando nome, e-mail e senha.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Felipe
 *               email:
 *                 type: string
 *                 example: felipe@email.com
 *               senha:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso.
 *       400:
 *         description: Nome, email e senha são obrigatórios.
 *       409:
 *         description: Este e-mail já está cadastrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/cadastro', cadastrar);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Autenticação
 *     summary: Realiza o login do usuário.
 *     description: Autentica um usuário utilizando e-mail e senha e retorna um token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 example: felipe@email.com
 *               senha:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login realizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     nome:
 *                       type: string
 *                       example: Felipe
 *                     email:
 *                       type: string
 *                       example: felipe@email.com
 *                     tipo:
 *                       type: string
 *                       example: cliente
 *       400:
 *         description: Email e senha são obrigatórios.
 *       401:
 *         description: Email ou senha inválidos.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/login', login);

router.post(
  '/recuperar-senha',
  solicitarRecuperacaoSenha
);

router.post(
  '/redefinir-senha',
  redefinirSenha
);

router.get('/me', autenticar, usuarioAtual);



module.exports = router;