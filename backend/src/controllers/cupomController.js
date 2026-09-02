const {
  criarCupom,
  listarCupons,
  buscarCupomPorCodigo,
  atualizarCupom,
  excluirCupom,
} = require('../models/cupomModel');

const { calcularDesconto } = require('../utils/cupomUtils');

async function criar(req, res) {
  try {
    const {
      codigo,
      tipoDesconto,
      valorDesconto,
      dataValidade,
    } = req.body;

    if (
      !codigo ||
      !tipoDesconto ||
      valorDesconto === undefined
    ) {
      return res.status(400).json({
        erro:
          'Código, tipo e valor do desconto são obrigatórios.',
      });
    }

    if (
      !['percentual', 'fixo'].includes(
        tipoDesconto
      )
    ) {
      return res.status(400).json({
        erro:
          "Tipo de desconto deve ser 'percentual' ou 'fixo'.",
      });
    }

    const valor = Number(
      valorDesconto
    );

    if (
      !Number.isFinite(valor) ||
      valor <= 0
    ) {
      return res.status(400).json({
        erro:
          'O valor do desconto deve ser maior que zero.',
      });
    }

    if (
      tipoDesconto ===
        'percentual' &&
      valor > 100
    ) {
      return res.status(400).json({
        erro:
          'O desconto percentual não pode ser maior que 100%.',
      });
    }

    const existente =
      await buscarCupomPorCodigo(
        codigo
      );

    if (existente) {
      return res.status(409).json({
        erro:
          'Já existe um cupom com este código.',
      });
    }

    const cupom =
      await criarCupom({
        codigo,
        tipoDesconto,
        valorDesconto: valor,
        dataValidade,
      });

    res.status(201).json(cupom);
  } catch (err) {
    console.error(err);

    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}

async function listar(req, res) {
  try {
    const cupons =
      await listarCupons();

    res.json(cupons);
  } catch (err) {
    console.error(err);

    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}

async function atualizar(req, res) {
  try {
    const {
      ativo,
    } = req.body;

    const cupom =
      await atualizarCupom(
        req.params.id,
        { ativo }
      );

    if (!cupom) {
      return res.status(404).json({
        erro:
          'Cupom não encontrado.',
      });
    }

    res.json(cupom);
  } catch (err) {
    console.error(err);

    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}

async function excluir(req, res) {
  try {
    const cupom =
      await excluirCupom(
        req.params.id
      );

    if (!cupom) {
      return res.status(404).json({
        erro:
          'Cupom não encontrado.',
      });
    }

    res.status(204).send();
  } catch (err) {
    console.error(err);

    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}



async function validar(req, res) {
  try {
    const {
      codigo,
      valorPedido,
    } = req.body;

    if (
      !codigo ||
      valorPedido ===
        undefined
    ) {
      return res.status(400).json({
        erro:
          'Código do cupom e valor do pedido são obrigatórios.',
      });
    }

    const pedido =
      Number(valorPedido);

    if (
      !Number.isFinite(pedido) ||
      pedido <= 0
    ) {
      return res.status(400).json({
        erro:
          'O valor do pedido é inválido.',
      });
    }

    const cupom =
      await buscarCupomPorCodigo(
        codigo
      );

    if (
      !cupom ||
      !cupom.ativo
    ) {
      return res.status(404).json({
        erro:
          'Cupom inválido ou inativo.',
      });
    }

    if (
      cupom.validade
    ) {
      const hoje =
        new Date();

      const validade =
        new Date(
          `${cupom.validade}T23:59:59`
        );

      if (
        validade < hoje
      ) {
        return res.status(400).json({
          erro:
            'Este cupom expirou.',
        });
      }
    }

    const valorDesconto =
      calcularDesconto(
        cupom,
        pedido
      );

    const valorFinal =
      Math.max(
        pedido -
          valorDesconto,
        0
      );

    res.json({
      cupom: {
        id: cupom.id,
        codigo:
          cupom.codigo,
        tipoDesconto:
          cupom.tipo_desconto,
        valor:
          Number(
            cupom.valor
          ),
      },

      valorDesconto,

      valorFinal,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}

module.exports = {
  criar,
  listar,
  atualizar,
  excluir,
  validar,
  calcularDesconto,
};