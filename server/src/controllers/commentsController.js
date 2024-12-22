const { Template, User, Tag, Question, Answer } = require("../models/index");
const CommentsService = require('../services/comments-service');
const jwt = require('jsonwebtoken');
const getUserIdFromToken = (req) => {
    const { refreshToken } = req.cookies; // Получаем токен из куки
    if (!refreshToken) return null;

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        console.log(decoded);
      return decoded.id; // Поле userId должно быть в payload токена
    } catch (err) {
      return null; // Невалидный токен
    }
  };
exports.getCommentsByTemplates = async (req, res, next) => {
    const {id:templateId}  = req.params;
    try {
        const comments = await CommentsService.getCommentsByTemplates(templateId);
        res.status(comments.status).json(comments.json);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getCommentsByUsers = async (req, res, next) => {
    const {id:userId} = req.params;
    try {
        console.log(req.body)
        const comments = await CommentsService.getCommentsByUsers(userId);
        res.status(comments.status).json(comments.json);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.addComment = async (req, res, next) => {
    const { id: templateId } = req.params;
    const { content } = req.body;
    const userId = getUserIdFromToken(req);

    if (!content) {
        return res.status(400).json({ error: 'Comment text is required' });
    }

    try {
        const comments = await CommentsService.addComments(content, templateId, userId);

        res.status(comments.status).json(comments.json);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};