const express = require('express');
const router = express.Router();
const { criar, listar, excluir } = require('../controllers/categoryController');
const { autenticar, apenasAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /categories:
 *   get:
 *     tags:
 *       - Categorias
 *     summary: Lista todas as categorias.
 *     description: Retorna todas as categorias cadastradas.
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/', listar);

/**
 * @swagger
 * /categories:
 *   post:
 *     tags:
 *       - Categorias
 *     summary: Cria uma nova categoria.
 *     description: Cadastra uma nova categoria. Apenas administradores podem acessar esta rota.
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
 *         description: Categoria criada com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Não autenticado.
 *       403:
 *         description: Acesso permitido apenas para administradores.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/', autenticar, apenasAdmin, criar);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     tags:
 *       - Categorias
 *     summary: Exclui uma categoria.
 *     description: Remove uma categoria do sistema. Apenas administradores podem acessar esta rota.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria.
 *     responses:
 *       200:
 *         description: Categoria removida com sucesso.
 *       401:
 *         description: Não autenticado.
 *       403:
 *         description: Acesso permitido apenas para administradores.
 *       404:
 *         description: Categoria não encontrada.
 *       500:
 *         description: Erro interno do servidor.
 */
router.delete('/:id', autenticar, apenasAdmin, excluir);

module.exports = router;