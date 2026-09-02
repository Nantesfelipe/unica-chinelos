const express = require('express');
const router = express.Router({ mergeParams: true });

const upload = require('../middlewares/uploadMiddleware');
const { upload: uploadImagens, listar } = require('../controllers/productImageController');
const { autenticar, apenasAdmin } = require('../middlewares/authMiddleware');

function tratarErroUpload(err, req, res, next) {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ erro: 'Imagem muito grande. Tamanho máximo: 5MB.' });
    }

    return res.status(400).json({ erro: err.message || 'Erro ao enviar imagem.' });
  }

  next();
}

/**
 * @swagger
 * /products/{id}/images:
 *   post:
 *     tags:
 *       - Imagens dos Produtos
 *     summary: Adiciona imagens a um produto.
 *     description: Faz upload de até 5 imagens para um produto. Apenas administradores podem acessar esta rota.
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               imagens:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Imagens enviadas com sucesso.
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
router.post(
  '/',
  autenticar,
  apenasAdmin,
  (req, res, next) => {
    upload.array('imagens', 5)(req, res, (err) => tratarErroUpload(err, req, res, next));
  },
  uploadImagens
);

/**
 * @swagger
 * /products/{id}/images:
 *   get:
 *     tags:
 *       - Imagens dos Produtos
 *     summary: Lista as imagens de um produto.
 *     description: Retorna todas as imagens cadastradas para um produto.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto.
 *     responses:
 *       200:
 *         description: Lista de imagens retornada com sucesso.
 *       404:
 *         description: Produto não encontrado.
 *       500:
 *         description: Erro interno do servidor.
 */
router.get('/', listar);

module.exports = router;