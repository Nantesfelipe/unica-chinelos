const express = require('express');

const router = express.Router({ mergeParams: true });
const { criar, listar } = require('../controllers/variationController');
const { autenticar, apenasAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /products/{id}/variations:
 *   get:
 *     tags:
 *       - Variações
 *     summary: Lista as variações de um produto.
 *     description: Retorna todas as variações cadastradas para um produto.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto.
 *     responses:
 *       200:
 *         description: Lista de variações retornada com sucesso.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/', listar);

/**
 * @swagger
 * /products/{id}/variations:
 *   post:
 *     tags:
 *       - Variações
 *     summary: Cadastra uma nova variação para um produto.
 *     description: Cria uma nova variação para um produto. Apenas administradores podem acessar esta rota.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Variação cadastrada com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Não autenticado.
 *       403:
 *         description: Acesso permitido apenas para administradores.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/', autenticar, apenasAdmin, criar);

module.exports = router;