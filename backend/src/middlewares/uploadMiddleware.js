const multer = require('multer');

const storage = multer.memoryStorage();

const TIPOS_PERMITIDOS = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB por arquivo
  },
  fileFilter: (req, file, cb) => {
    if (!TIPOS_PERMITIDOS.includes(file.mimetype)) {
      return cb(
        new Error('Formato de imagem não permitido. Envie JPEG, PNG ou WEBP.')
      );
    }

    cb(null, true);
  },
});

module.exports = upload;