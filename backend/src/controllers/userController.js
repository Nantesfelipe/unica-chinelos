const {
  listarClientes,
  buscarClienteComPedidos,
} = require('../models/userModel');

async function listarClientesController(
  req,
  res
) {
  try {
    const clientes = await listarClientes();

    res.json(clientes);
  } catch (err) {
    res.status(500).json({
      erro: err.message,
    });
  }
}

async function buscarClienteController(
  req,
  res
) {
  try {
    const cliente =
      await buscarClienteComPedidos(
        req.params.id
      );

    if (!cliente) {
      return res.status(404).json({
        erro: 'Cliente não encontrado.',
      });
    }

    res.json(cliente);
  } catch (err) {
    res.status(500).json({
      erro: err.message,
    });
  }
}

module.exports = {
  listarClientesController,
  buscarClienteController,
};