const bcrypt = require('bcrypt'); //importa a biblioteca gerar hash e comparar senhas
const { criarUsuario, buscarPorEmail } = require('../models/usuarioModel');

async function cadastrar(req, res) {
  try {
    const { nome, email, senha } = req.body;
    /*desestrutura em 3 varaveis, pois o req.body = {
    "nome": "Felipe",
    "email": "felipe@email.com",
    "senha": "123456"*/

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios.' });
    }

    const usuarioExistente = await buscarPorEmail(email);

    if (usuarioExistente) {
        //se encontrou o usuario:
      return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10); //recebe a senha e devolve um hash de 10 digitos
    const novoUsuario = await criarUsuario({ nome, email, senhaHash }); //registra o usuario com a hash

    res.status(201).json(novoUsuario);

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}

module.exports = { cadastrar };