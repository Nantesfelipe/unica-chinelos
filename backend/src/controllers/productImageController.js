const cloudinary = require('../config/cloudinary'); //Importa a configuração do Cloudinary.

const { adicionarImagem, listarImagensPorProduto } = require('../models/productImageModel'); //importando funções de adcionar e buscar imagem  do model



async function upload(req, res) {

  try {

    const { id: produtoId } = req.params;

    if (!req.files || req.files.length === 0) {  //verifica se alguma imagem foi enviada
      return res.status(400).json({ erro: 'Nenhuma imagem enviada.' });
    }

    const imagensSalvas = [];

    for (let i = 0; i < req.files.length; i++) {

      const file = req.files[i];
      const resultadoUpload = await new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
          { folder: 'unica-chinelos/produtos' }, // informa ao cloudinary qual pasta a imagem sera salva
          (err, result) => (err ? reject(err) : resolve(result))
        );
        stream.end(file.buffer); //Envie todos os bytes dessa imagem para o Cloudinary e finalize o envio.
      });
    
      const imagem = await adicionarImagem(produtoId, resultadoUpload.secure_url, i);
      imagensSalvas.push(imagem);
    }

    res.status(201).json(imagensSalvas);
  } catch (err) {
    console.error(err);

    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}

async function listar(req, res) {
  try {
    const imagens = await listarImagensPorProduto(req.params.id);
    res.json(imagens);
  } catch (err) {
    console.error(err);

    res.status(500).json({ erro: 'Erro interno do servidor.' });
  }
}




module.exports = { upload, listar };