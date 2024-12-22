const { Tag } = require('../models/index.js');
exports.getTags = async (req, res, next) => {
    try {
      const tags = await Tag.findAll({});
      return res.json(tags);
    } catch (error) {
        console.error('Ошибка при добавлении лайка:', error); // Логируем полную ошибку
        return res.status(500).json({ error: 'Ошибка при добавлении лайка', details: error.message });
      }
};

exports.createTag = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Поле name обязательно для создания тега.' });
  }

  try {
    const newTag = await Tag.create({ name });
    return res.status(201).json(newTag);
  } catch (error) {
    console.error('Ошибка при создании тега:', error);
    return res.status(500).json({ error: 'Ошибка при создании тега', details: error.message });
  }
};
