const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const {
  criarUsuario,
  buscarPorEmail,
  buscarPorId,
  criarTokenRecuperacao,
  buscarPorTokenRecuperacao,
  atualizarSenhaPorToken,
} = require('../models/userModel');

const transporter =
  nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(
      process.env.EMAIL_PORT
    ),
    secure:
      Number(
        process.env.EMAIL_PORT
      ) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

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
      await bcrypt.hash(
        senha,
        10
      );

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

async function solicitarRecuperacaoSenha(
  req,
  res
) {
  try {
    const { email } =
      req.body;

    if (!email) {
      return res.status(400).json({
        erro: 'Informe seu e-mail.',
      });
    }

    const emailNormalizado =
      email.trim().toLowerCase();

    const usuario =
      await buscarPorEmail(
        emailNormalizado
      );

    /*
     * Não revelamos se o e-mail
     * existe ou não.
     */
    if (!usuario) {
      return res.json({
        mensagem:
          'Se o e-mail estiver cadastrado, você receberá as instruções para recuperar sua senha.',
      });
    }

    const token =
      crypto.randomBytes(32).toString('hex');

    const expiraEm =
      new Date(
        Date.now() +
          30 * 60 * 1000
      );

    await criarTokenRecuperacao(
      emailNormalizado,
      token,
      expiraEm
    );

    const frontendUrl =
      process.env.FRONTEND_URL ||
      'http://localhost:5173';

    const link =
      `${frontendUrl}/redefinir-senha?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: emailNormalizado,

      subject:
        'Recuperação de senha - Única Conceitos',

      text: `
Olá, ${usuario.nome}!

Recebemos uma solicitação para redefinir a senha da sua conta na Única Conceitos.

Acesse o link abaixo para criar uma nova senha:

${link}

Este link é válido por 30 minutos.

Se você não solicitou a recuperação da senha, ignore este e-mail.

Única Conceitos
      `.trim(),

      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Recuperação de senha</title>
          </head>

          <body
            style="
              margin: 0;
              padding: 0;
              background: #e2dacc;
              font-family: Arial, sans-serif;
            "
          >
            <div
              style="
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
              "
            >
              <div
                style="
                  background: #171511;
                  padding: 28px;
                  text-align: center;
                "
              >
                <h1
                  style="
                    margin: 0;
                    color: #e2dacc;
                    font-size: 24px;
                  "
                >
                  Única Conceitos
                </h1>
              </div>

              <div
                style="
                  padding: 32px;
                  color: #171511;
                "
              >
                <h2
                  style="
                    margin-top: 0;
                    font-size: 22px;
                  "
                >
                  Recuperação de senha
                </h2>

                <p>
                  Olá, ${usuario.nome}!
                </p>

                <p
                  style="
                    color: #746c5c;
                    line-height: 1.6;
                  "
                >
                  Recebemos uma solicitação para
                  redefinir a senha da sua conta.
                </p>

                <div
                  style="
                    text-align: center;
                    margin: 30px 0;
                  "
                >
                  <a
                    href="${link}"
                    style="
                      display: inline-block;
                      padding: 14px 24px;
                      background: #171511;
                      color: #e2dacc;
                      text-decoration: none;
                      border-radius: 6px;
                      font-weight: bold;
                    "
                  >
                    Redefinir minha senha
                  </a>
                </div>

                <p
                  style="
                    color: #8e8980;
                    font-size: 14px;
                    line-height: 1.6;
                  "
                >
                  Este link é válido por
                  <strong>30 minutos</strong>.
                </p>

                <p
                  style="
                    color: #8e8980;
                    font-size: 14px;
                    line-height: 1.6;
                  "
                >
                  Se você não solicitou a recuperação
                  da senha, ignore este e-mail.
                </p>

                <hr
                  style="
                    margin: 30px 0;
                    border: 0;
                    border-top: 1px solid #e2dacc;
                  "
                />

                <p
                  style="
                    margin: 0;
                    color: #8e8980;
                    font-size: 12px;
                  "
                >
                  Única Conceitos
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    res.json({
      mensagem:
        'Se o e-mail estiver cadastrado, você receberá as instruções para recuperar sua senha.',
    });
  } catch (err) {
    console.error(
      'Erro na recuperação de senha:',
      err
    );

    res.status(500).json({
      erro:
        'Não foi possível processar a recuperação de senha.',
    });
  }
}

async function redefinirSenha(
  req,
  res
) {
  try {
    const {
      token,
      senha,
    } = req.body;

    if (!token || !senha) {
      return res.status(400).json({
        erro:
          'Token e nova senha são obrigatórios.',
      });
    }

    if (senha.length < 6) {
      return res.status(400).json({
        erro:
          'A nova senha deve possuir pelo menos 6 caracteres.',
      });
    }

    const usuario =
      await buscarPorTokenRecuperacao(
        token
      );

    if (!usuario) {
      return res.status(400).json({
        erro:
          'O token é inválido ou expirou.',
      });
    }

    const senhaHash =
      await bcrypt.hash(
        senha,
        10
      );

    const usuarioAtualizado =
      await atualizarSenhaPorToken(
        usuario.id,
        senhaHash
      );

    if (!usuarioAtualizado) {
      return res.status(404).json({
        erro:
          'Usuário não encontrado.',
      });
    }

    res.json({
      mensagem:
        'Senha redefinida com sucesso.',
    });
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
  solicitarRecuperacaoSenha,
  redefinirSenha,
};