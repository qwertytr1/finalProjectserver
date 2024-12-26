const { Like, Template } = require('../models/index.js');
const jwt = require('jsonwebtoken'); // Для работы с токенами


// Получение количества лайков для шаблона
exports.getLikes = async (req, res, next) => {
  const { id: templateId } = req.params;

  try {
    // Считаем количество лайков для шаблона
    const likesCount = await Like.count({ where: { templates_id: templateId } });
    return res.json({ templateId, likes: likesCount });
  } catch (error) {
    return res.status(500).json({ error: 'Ошибка при получении количества лайков' });
  }
};

// Добавление лайка к шаблону
exports.addLike = async (req, res) => {
    const templateId = req.params.id;
    const accessToken = req.headers['authorization']?.split(' ')[1];
    if (!accessToken) {
        throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateAccessToken(accessToken);
    const userId = userData.id;
    if (!userId) {
      return res.status(401).json({ error: 'Пользователь не авторизован' });
    }

    try {
      const existingLike = await Like.findOne({
        where: {  users_id: userId, templates_id: templateId}
      });

      if (existingLike) {
        return res.status(400).json({ message: 'Вы уже поставили лайк этому шаблону' });
      }

      await Like.create({ templates_id: templateId, users_id: userId });
      return res.status(201).json({ message: 'Лайк успешно добавлен' });
    }  catch (error) {
        console.error('Ошибка при добавлении лайка:', error); // Логируем полную ошибку
        return res.status(500).json({ error: 'Ошибка при добавлении лайка', details: error.message });
      }
  };

  // Удаление лайка с шаблона
  exports.removeLike = async (req, res) => {
    const  templateId  = req.params.id;
    const accessToken = req.headers['authorization']?.split(' ')[1];
    if (!accessToken) {
        throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateAccessToken(accessToken);
    const userId = userData.id;

    if (!userId) {
      return res.status(401).json({ error: 'Пользователь не авторизован' });
    }

    try {
      const like = await Like.findOne({
        where: { templates_id: templateId, users_id: userId }
      });

      if (!like) {
        return res.status(404).json({ message: 'Лайк не найден' });
      }

      await like.destroy();
      return res.json({ message: 'Лайк успешно удален' });
    } catch (error) {
        console.error('Ошибка при добавлении лайка:', error); // Логируем полную ошибку
      return res.status(500).json({ error: 'Ошибка при удалении лайка' });
    }
  };