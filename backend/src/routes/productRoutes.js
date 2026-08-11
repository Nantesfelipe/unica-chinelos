const productImageRoutes = require('./productImageRoutes');
const express = require('express');
const router = express.Router();
const { criar, listar, buscarPorId, atualizar, desativar, reativar, excluirDefinitivo } = require('../controllers/productController');

const { autenticar, apenasAdmin } = require('../middlewares/authMiddleware');
const variationRoutes = require('./variationRoutes');

/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *       - Produtos
 *     summary: Lista todos os produtos.
 *     description: Retorna todos os produtos cadastrados.
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/', listar);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags:
 *       - Produtos
 *     summary: Busca um produto pelo ID.
 *     description: Retorna os detalhes de um produto específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto.
 *     responses:
 *       200:
 *         description: Produto encontrado.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/:id', buscarPorId);

/**
 * @swagger
 * /products:
 *   post:
 *     tags:
 *       - Produtos
 *     summary: Cadastra um novo produto.
 *     description: Cria um novo produto. Apenas administradores podem acessar esta rota.
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
 *         description: Produto cadastrado com sucesso.
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
 * /products/{id}:
 *   put:
 *     tags:
 *       - Produtos
 *     summary: Atualiza um produto.
 *     description: Atualiza as informações de um produto existente. Apenas administradores podem acessar esta rota.
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
 *       200:
 *         description: Produto atualizado com sucesso.
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
router.put('/:id', autenticar, apenasAdmin, atualizar);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     tags:
 *       - Produtos
 *     summary: Exclui um produto.
 *     description: Remove um produto do sistema. Apenas administradores podem acessar esta rota.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto.
 *     responses:
 *       200:
 *         description: Produto removido com sucesso.
 *       401:
 *         description: Não autenticado.
 *       403:
 *         description: Acesso permitido apenas para administradores.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.delete('/:id', autenticar, apenasAdmin, desativar);
router.delete('/:id/definitivo', autenticar, apenasAdmin, excluirDefinitivo);
router.patch('/:id/reativar', autenticar, apenasAdmin, reativar);

router.use('/:id/variations', variationRoutes);
router.use('/:id/images', productImageRoutes);


module.exports = router;