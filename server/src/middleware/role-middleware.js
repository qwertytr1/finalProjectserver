const tokenService = require('../services/token-service');
const ApiError = require('../exceptions/api-error');
const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
    const { refreshToken } = req.cookies; // Получаем токен из куки
    if (!refreshToken) return null;
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        console.log('Decoded token:', decoded);
        const role = decoded.role;
        if (role !== 'admin') {
            throw ApiError.BadRequest('У вас нет прав на редактирование');
        }
        req.user = role;
        next();
    } catch (e) {
        console.error('Token validation error:', e.message);
        return next(ApiError.UnauthorizedError());
    }
}