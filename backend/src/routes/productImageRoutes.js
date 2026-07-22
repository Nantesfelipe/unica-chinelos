const express = require('express');
const router = express.Router({ mergeParams: true });
const upload = require('../middlewares/uploadMiddleware');
const { upload: uploadImagens, listar } = require('../controllers/productImageController');
const { autenticar, apenasAdmin } = require('../middlewares/authMiddleware');

router.post('/', autenticar, apenasAdmin, upload.array('imagens', 5), uploadImagens);
router.get('/', listar);

module.exports = router;