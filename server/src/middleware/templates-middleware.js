const tokenService = require('../services/token-service');
const ApiError = require('../exceptions/api-error');
const jwt = require('jsonwebtoken');
const {TemplatesAccess} = require('../models/index.js'); // Импорт модели Template Access

module.exports = async (req, res, next) => {
    const { refreshToken } = req.cookies; // Получаем токен из куки
    if (!refreshToken) return next(ApiError.UnauthorizedError());

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        console.log('Decoded token:', decoded);

        const { role, id: userId } = decoded;

        // Проверка роли
        if (role !== 'admin') {
            throw ApiError.BadRequest('У вас нет прав на редактирование');
        }

        // Если требуется проверка доступа к шаблону
        const { templateId } = req.body; // Предполагается, что ID шаблона передается в теле запроса
        if (templateId) {
            const access = await TemplatesAccess.findOne({
                where: {
                    template_id: templateId,
                    users_id: userId,
                },
            });

            if (!access) {
                throw ApiError.BadRequest('У вас нет прав на редактирование данного шаблона');
            }
        }

        req.user = { role, userId }; // Сохраняем роль и ID пользователя для дальнейшего использования
        next();
    } catch (e) {
        console.error('Token validation error:', e.message);
        return next(ApiError.UnauthorizedError());
    }
};
