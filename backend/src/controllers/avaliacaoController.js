const {
  usuarioComprouProduto,
  criarAvaliacao,
  listarAvaliacoesPorProduto,
  buscarMediaProduto,
  buscarAvaliacaoPorId,
  excluirAvaliacao,
} = require('../models/avaliacaoModel');

async function criar(req, res) {
  try {
    const produtoId = req.params.id;
    const { nota, comentario } = req.body;

    if (!nota || nota < 1 || nota > 5) {
      return res.status(400).json({ erro: 'A nota deve ser um número entre 1 e 5.' });
    }

    const comprou = await usuarioComprouProduto(req.usuario.id, produtoId);

    if (!comprou) {
      return res.status(403).json({
        erro: 'Você só pode avaliar produtos que já comprou e recebeu.',
      });
    }

    const avaliacao = await criarAvaliacao({
      produtoId,
      usuarioId: req.usuario.id,
      nota,
      comentario,
    });

    res.status(201).json(avaliacao);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ erro: 'Você já avaliou este produto.' });
    }

    res.status(500).json({ erro: err.message });
  }
}

async function listar(req, res) {
  try {
    const produtoId = req.params.id;
    const [avaliacoes, resumo] = await Promise.all([
      listarAvaliacoesPorProduto(produtoId),
      buscarMediaProduto(produtoId),
    ]);

    res.json({
      avaliacoes,
      media: resumo.media,
      total: resumo.total,
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

async function excluir(req, res) {
  try {
    const avaliacao = await buscarAvaliacaoPorId(req.params.avaliacaoId);

    if (!avaliacao) {
      return res.status(404).json({ erro: 'Avaliação não encontrada.' });
    }

    if (avaliacao.usuario_id !== req.usuario.id && req.usuario.tipo !== 'admin') {
      return res.status(403).json({ erro: 'Acesso negado.' });
    }

    await excluirAvaliacao(req.params.avaliacaoId);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

module.exports = { criar, listar, excluir };