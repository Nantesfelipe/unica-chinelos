const {
  criarCupom,
  listarCupons,
  buscarCupomPorCodigo,
  atualizarCupom,
  excluirCupom,
} = require('../models/cupomModel');

async function criar(req, res) {
  try {
    const { codigo, tipoDesconto, valorDesconto, valorMinimoPedido, dataValidade, limiteUso } = req.body;

    if (!codigo || !tipoDesconto || !valorDesconto) {
      return res.status(400).json({ erro: 'Código, tipo e valor do desconto são obrigatórios.' });
    }

    if (!['percentual', 'fixo'].includes(tipoDesconto)) {
      return res.status(400).json({ erro: "Tipo de desconto deve ser 'percentual' ou 'fixo'." });
    }

    const existente = await buscarCupomPorCodigo(codigo);
    if (existente) {
      return res.status(409).json({ erro: 'Já existe um cupom com este código.' });
    }

    const cupom = await criarCupom({ codigo, tipoDesconto, valorDesconto, valorMinimoPedido, dataValidade, limiteUso });
    res.status(201).json(cupom);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

async function listar(req, res) {
  try {
    const cupons = await listarCupons();
    res.json(cupons);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

async function atualizar(req, res) {
  try {
    const { ativo } = req.body;
    const cupom = await atualizarCupom(req.params.id, { ativo });

    if (!cupom) {
      return res.status(404).json({ erro: 'Cupom não encontrado.' });
    }

    res.json(cupom);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

async function excluir(req, res) {
  try {
    const cupom = await excluirCupom(req.params.id);

    if (!cupom) {
      return res.status(404).json({ erro: 'Cupom não encontrado.' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

function calcularDesconto(cupom, valorPedido) {
  if (cupom.tipo_desconto === 'percentual') {
    return (Number(valorPedido) * Number(cupom.valor_desconto)) / 100;
  }
  return Math.min(Number(cupom.valor_desconto), Number(valorPedido));
}

async function validar(req, res) {
  try {
    const { codigo, valorPedido } = req.body;

    if (!codigo || valorPedido === undefined) {
      return res.status(400).json({ erro: 'Código do cupom e valor do pedido são obrigatórios.' });
    }

    const cupom = await buscarCupomPorCodigo(codigo);

    if (!cupom || !cupom.ativo) {
      return res.status(404).json({ erro: 'Cupom inválido ou inativo.' });
    }

    if (cupom.data_validade && new Date(cupom.data_validade) < new Date()) {
      return res.status(400).json({ erro: 'Este cupom expirou.' });
    }

    if (cupom.limite_uso !== null && cupom.usos_realizados >= cupom.limite_uso) {
      return res.status(400).json({ erro: 'Este cupom atingiu o limite de uso.' });
    }

    if (Number(valorPedido) < Number(cupom.valor_minimo_pedido)) {
      return res.status(400).json({
        erro: `Valor mínimo do pedido para este cupom é R$ ${Number(cupom.valor_minimo_pedido).toFixed(2)}.`,
      });
    }

    const valorDesconto = calcularDesconto(cupom, valorPedido);

    res.json({
      cupom: { id: cupom.id, codigo: cupom.codigo, tipoDesconto: cupom.tipo_desconto },
      valorDesconto,
      valorFinal: Number(valorPedido) - valorDesconto,
    });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

module.exports = { criar, listar, atualizar, excluir, validar, calcularDesconto };