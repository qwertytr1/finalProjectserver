const multer = require('multer');

// Настраиваем multer для хранения файлов во временной папке
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

module.exports = upload;