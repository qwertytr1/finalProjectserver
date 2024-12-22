const { Template, Question, Comment } = require('../models/index.js');
const { Op } = require('sequelize');

exports.searchTemplates = async (req, res) => {
  const { query } = req.query; // Извлекаем строку поиска из параметров запроса

  if (!query) {
    return res.status(400).json({ error: 'Параметр "query" обязателен для поиска.' });
  }

  try {
    // Ищем совпадения по названию и описанию шаблонов
    const templates = await Template.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } }
        ]
      }
    });

    // Ищем совпадения в вопросах
    const questions = await Question.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } }
        ]
      }
    });

    // Ищем совпадения в комментариях
    const comments = await Comment.findAll({
      where: {
        content: { [Op.like]: `%${query}%` }
      }
    });

    // Формируем ответ
    return res.status(200).json({
      templates,
      questions,
      comments
    });
  } catch (error) {
    console.error('Ошибка при выполнении поиска:', error);
    return res.status(500).json({ error: 'Ошибка при выполнении поиска', details: error.message });
  }
};
