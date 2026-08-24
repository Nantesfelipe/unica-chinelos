const { calcularFrete } = require('../services/freteService');

async function calcular(req, res) {
  try {
    const { cep, quantidadeItens, valorPedido } = req.body;

    if (!cep) {
      return res.status(400).json({ erro: 'CEP é obrigatório.' });
    }

    const resultado = await calcularFrete(cep, quantidadeItens, valorPedido);
    res.json(resultado);
  } catch (err) {
    if (err.code === 'CEP_INVALIDO' || err.code === 'CEP_NAO_ENCONTRADO') {
      return res.status(400).json({ erro: err.message });
    }

    res.status(500).json({ erro: 'Não foi possível calcular o frete.' });
  }
}

module.exports = { calcular };