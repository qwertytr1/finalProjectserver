const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authService = require("../services/auth-service");
const { validationResult } = require('express-validator');
const ApiError = require("../exceptions/api-error");
exports.register = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Error in validation', errors.array()));
        }
        console.log(req.body);
        const { username, email, password, language, theme, role, isBlocked } = req.body;
        const userData = await authService.register(username, email, password, language, theme, role, isBlocked);
        return res.status(201).json(
            userData
        );
    } catch (error) {
        next(error)
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const userData = await authService.login( email, password);
        return res.status(201).json(userData);
    } catch (error) {
        next(error)
    }
}
exports.logout = async (req, res, next) => {
    try {
        const accessToken = req.headers['authorization']?.split(' ')[1];
        return res.json({ message: 'Logout successful' });
    } catch (e) {
        next(e);
    }
}
exports.refresh = async (req, res, next) => {
    try {
        const accessToken = req.headers['authorization']?.split(' ')[1];
        if (!accessToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = await authService.refreshAccessToken(accessToken);
        return res.json(userData);
    } catch (e) {
        console.error('Ошибка в /refresh:', e);
        next(e);
    }
};
