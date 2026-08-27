const express = require('express');
const router = express.Router();

const {
  finalizar,
  atualizarStatus,
  meusPedidos,
  todosPedidos,
  detalhesPedido,
  cancelarPedido,
  webhook,
} = require('../controllers/orderController');

const { autenticar, apenasAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /orders:
 *   post:
 *     tags:
 *       - Pedidos
 *     summary: Finaliza um pedido.
 *     description: Cria um novo pedido para o usuário autenticado.
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
 *         description: Pedido criado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Não autenticado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.post('/', autenticar, finalizar);

/**
 * @swagger
 * /orders:
 *   get:
 *     tags:
 *       - Pedidos
 *     summary: Lista os pedidos do usuário.
 *     description: Retorna todos os pedidos do usuário autenticado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso.
 *       401:
 *         description: Não autenticado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/', autenticar, meusPedidos);

router.get('/admin', autenticar, apenasAdmin, todosPedidos);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags:
 *       - Pedidos
 *     summary: Busca um pedido pelo ID.
 *     description: Retorna os detalhes de um pedido específico.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido.
 *     responses:
 *       200:
 *         description: Pedido encontrado.
 *       401:
 *         description: Não autenticado.
 *       404:
 *         description: Pedido não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/:id', autenticar, detalhesPedido);

router.patch(
  '/:id/cancel',
  autenticar,
  cancelarPedido
);

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     tags:
 *       - Pedidos
 *     summary: Atualiza o status de um pedido.
 *     description: Atualiza o status de um pedido. Apenas administradores podem acessar esta rota.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Status do pedido atualizado com sucesso.
 *       400:
 *         description: Dados inválidos.
 *       401:
 *         description: Não autenticado.
 *       403:
 *         description: Acesso permitido apenas para administradores.
 *       404:
 *         description: Pedido não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.put('/:id/status', autenticar, apenasAdmin, atualizarStatus);

router.post('/webhook', webhook);

module.exports = router;