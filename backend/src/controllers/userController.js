const {
  listarClientes,
  buscarClienteComPedidos,
  atualizarPerfil,
  buscarPorId,
} = require('../models/userModel');

async function listarClientesController(
  req,
  res
) {
  try {
    const {
      pagina = 1,
      porPagina = 20,
      busca = '',
    } = req.query;

    const resultado = await listarClientes({
      pagina,
      porPagina,
      busca,
    });

    res.json(resultado);
  } catch (err) {
    console.error(err);

    res.status(500).json({ erro: 'Erro interno do servidor.' });
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
    console.error(err);

    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}

async function atualizarMeuPerfil(
  req,
  res
) {
  try {
    const {
      nome,
      telefone,
      cpf,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
    } = req.body;

    if (!nome || !nome.trim()) {
      return res.status(400).json({
        erro: 'O nome é obrigatório.',
      });
    }

    const usuario =
      await atualizarPerfil(
        req.usuario.id,
        {
          nome: nome.trim(),
          telefone:
            telefone?.trim() || null,
          cpf:
            cpf?.trim() || null,
          cep:
            cep?.trim() || null,
          logradouro:
            logradouro?.trim() || null,
          numero:
            numero?.trim() || null,
          complemento:
            complemento?.trim() || null,
          bairro:
            bairro?.trim() || null,
          cidade:
            cidade?.trim() || null,
          estado:
            estado?.trim()
              .toUpperCase() || null,
        }
      );

    if (!usuario) {
      return res.status(404).json({
        erro: 'Usuário não encontrado.',
      });
    }

    res.json(usuario);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({
        erro: 'Este CPF já está cadastrado.',
      });
    }

    console.error(err);

    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}

async function meuPerfil(
  req,
  res
) {
  try {
    const usuario =
      await buscarPorId(
        req.usuario.id
      );

    if (!usuario) {
      return res.status(404).json({
        erro: 'Usuário não encontrado.',
      });
    }

    res.json(usuario);
  } catch (err) {
    console.error(err);

    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}

module.exports = {
  listarClientesController,
  buscarClienteController,
  atualizarMeuPerfil,
  meuPerfil,
};