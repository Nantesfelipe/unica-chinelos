const bcrypt = require('bcrypt'); //importa a biblioteca gerar hash e comparar senha
const jwt = require('jsonwebtoken');
const { criarUsuario, buscarPorEmail } = require('../models/userModel');


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

async function login (req, res){

  try{
    const {email, senha} = req.body;

    if(!email || !senha){
      return res.status(400).json({erro: 'Email e senha são obrigatórios.'});
    }

    const usuario = await buscarPorEmail(email);
    if(!usuario){
      return res.status(401).json({erro:'Email ou senha inválidos'});
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
    if(!senhaCorreta){
      return res.status(401).json({erro:'Email ou senha inválidos.'});
    }

    const token = jwt.sign(

      //payload
      { id: usuario.id,
        tipo: usuario.tipo
      }, 
      
      process.env.JWT_SECRET,
      { expiresIn: '7d'}
    );

      //apos autenticacao enviar token
    res.json({
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo }
    });

  }catch(err){
    res.status(500).json({erro: err.message})
  }

}
module.exports = { cadastrar, login };