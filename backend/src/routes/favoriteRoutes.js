const express = require('express');
const router = express.Router();

const { adicionar, remover, listar } = require('../controllers/favoriteController');
const { autenticar } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /favorites:
 *   get:
 *     tags:
 *       - Favoritos
 *     summary: Lista os produtos favoritos do usuário.
 *     description: Retorna todos os produtos marcados como favoritos pelo usuário autenticado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de favoritos retornada com sucesso.
 *       401:
 *         description: Não autenticado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/', autenticar, listar);

/**
 * @swagger
 * /favorites:
 *   post:
 *     tags:
 *       - Favoritos
 *     summary: Adiciona um produto aos favoritos.
 *     description: Adiciona um produto à lista de favoritos do usuário autenticado.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Produto adicionado aos favoritos.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Não autenticado.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/', autenticar, adicionar);

/**
 * @swagger
 * /favorites/{produtoId}:
 *   delete:
 *     tags:
 *       - Favoritos
 *     summary: Remove um produto dos favoritos.
 *     description: Remove um produto da lista de favoritos do usuário autenticado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: produtoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto.
 *     responses:
 *       200:
 *         description: Produto removido dos favoritos.
 *       401:
 *         description: Não autenticado.
 *       404:
 *         description: Produto não encontrado nos favoritos.
 *       500:
 *         description: Erro interno do servidor.
 */
router.delete('/:produtoId', autenticar, remover);

module.exports = router;