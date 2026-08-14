const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {
  criarUsuario,
  buscarPorEmail,
  buscarPorId,
} = require('../models/userModel');

async function cadastrar(req, res) {
  try {
    const {
      nome,
      email,
      senha,
    } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        erro: 'Nome, email e senha são obrigatórios.',
      });
    }

    const usuarioExistente =
      await buscarPorEmail(email);

    if (usuarioExistente) {
      return res.status(409).json({
        erro: 'Este e-mail já está cadastrado.',
      });
    }

    const senhaHash =
      await bcrypt.hash(senha, 10);

    const novoUsuario =
      await criarUsuario({
        nome,
        email,
        senhaHash,
      });

    res.status(201).json(
      novoUsuario
    );
  } catch (err) {
    res.status(500).json({
      erro: err.message,
    });
  }
}

async function login(req, res) {
  try {
    const {
      email,
      senha,
    } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        erro: 'Email e senha são obrigatórios.',
      });
    }

    const usuario =
      await buscarPorEmail(email);

    if (!usuario) {
      return res.status(401).json({
        erro: 'Email ou senha inválidos.',
      });
    }

    const senhaCorreta =
      await bcrypt.compare(
        senha,
        usuario.senha_hash
      );

    if (!senhaCorreta) {
      return res.status(401).json({
        erro: 'Email ou senha inválidos.',
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        tipo: usuario.tipo,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    res.json({
      token,

      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
        created_at:
          usuario.created_at,
        telefone:
          usuario.telefone,
        cpf:
          usuario.cpf,
        cep:
          usuario.cep,
        logradouro:
          usuario.logradouro,
        numero:
          usuario.numero,
        complemento:
          usuario.complemento,
        bairro:
          usuario.bairro,
        cidade:
          usuario.cidade,
        estado:
          usuario.estado,
      },
    });
  } catch (err) {
    res.status(500).json({
      erro: err.message,
    });
  }
}

async function usuarioAtual(
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
    res.status(500).json({
      erro: err.message,
    });
  }
}

module.exports = {
  cadastrar,
  login,
  usuarioAtual,
};