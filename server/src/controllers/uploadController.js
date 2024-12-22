const cloudinary = require('../config/cloudinary.js');

const { Template } = require('../models/index.js'); // Импортируем модель Template

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не был загружен' });
    }

    // Загружаем файл в Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Создаем новую запись в таблице templates (или обновляем существующую запись)
    const { title, description, category, is_public } = req.body; // Получаем данные из тела запроса
    const template = await Template.create({
      image_url: result.secure_url, // URL загруженного изображения
    });

    return res.status(201).json({
      message: 'Изображение успешно загружено и добавлено в шаблон',
      template,
    });
  } catch (error) {
    console.error('Ошибка при загрузке изображения:', error);
    return res.status(500).json({ error: 'Ошибка при загрузке изображения' });
  }
};

exports.deleteImage = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'ID изображения обязателен для удаления' });
  }

  try {
    // Удаление изображения из Cloudinary по public_id
    await cloudinary.uploader.destroy(id);
    return res.status(200).json({ message: 'Изображение успешно удалено' });
  } catch (error) {
    console.error('Ошибка при удалении изображения:', error);
    return res.status(500).json({ error: 'Ошибка при удалении изображения' });
  }
};
