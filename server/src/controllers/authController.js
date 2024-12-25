const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require("../services/user-service");
const { validationResult } = require('express-validator');
const ApiError = require("../exceptions/api-error");
const tokenService = require('../services/token-service.js')
exports.register = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest('Error in validation', errors.array()));
        }
        console.log(req.body);
        const { username, email, password, language, theme, role, isBlocked } = req.body;
        const userData = await userService.register(username, email, password, language, theme, role, isBlocked);
  res.cookie('refreshToken', userData.refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
    httpOnly: true,                  // Защита от доступа из JavaScript
    secure: process.env.NODE_ENV === 'production', // Только через HTTPS
    sameSite: 'strict',              // Запрет межсайтовой передачи
});

        return res.status(201).json({
            message: 'User registered successfully.',
            userData,
        });
    } catch (error) {
        next(error)
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        const userData = await userService.login( email, password);
res.cookie('refreshToken', userData.refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
    httpOnly: true,                  // Защита от доступа из JavaScript
   secure: false, // Отключите для localhost
    sameSite: 'strict',              // Запрет межсайтовой передачи
});

        return res.status(201).json({
            message: 'User login successfully.',
            userData,
        });
    } catch (error) {
        next(error)
    }
}
exports.logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        console.log(refreshToken)
        const token = await userService.logout(refreshToken);
        res.clearCookie('refreshToken');
        return res.json(token);
    } catch (e) {
        next(e)
}

};
exports.refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.cookies;
        console.log('Получен refreshToken:', refreshToken);

        const userData = await userService.refresh(refreshToken);
        console.log('Новый refreshToken:', userData.refreshToken);

        res.cookie('refreshToken', userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
   secure: false, // Отключите для localhost
            sameSite: 'strict',
        });

        return res.json(userData);
    } catch (e) {
        console.error('Ошибка в /refresh:', e);
        next(e);
    }
};
exports.refreshAccessToken = async (req, res, next) => {
    try {
        const oldAccessToken = req.headers['authorization']?.split(' ')[1];
        if (!oldAccessToken) {
            throw ApiError.UnauthorizedError();
        }

        // Извлекаем данные из токена, даже если он истёк
        const userData = tokenService.validateAccessToken(oldAccessToken, { ignoreExpiration: true });
        if (!userData) {
            throw ApiError.UnauthorizedError();
        }

        // Генерация нового токена
        const newAccessToken = tokenService.generateAccessToken({ id: userData.id, role: userData.role });

        return res.json({ accessToken: newAccessToken });
    } catch (e) {
        next(e);
    }
};
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        return res.json(users);
    } catch (error) {
        next(error)
    }
};
exports.getUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (id) {
            const user = await userService.getUserById(id);
            return res.json(user);
        } else {
            throw ApiError.UnauthorizedError();
        }
    } catch (error) {
        next(error);
    }
};

exports.editUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const data = req.body;
        const updatedUser = await userService.editUserById(id, data);
        return res.json(updatedUser);
    } catch (error) {
        next(error);
    }
};

exports.toggleBlock = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const status = await userService.toggleBlockByToken(userId);
        return res.json(status);
    } catch (error) {
        console.error(error); // Логирование ошибки в консоль для дебага
        return res.status(500).json({ message: 'Ошибка при блокировке пользователя', error: error.message });
    }
};

exports.toggleUnblock = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const status = await userService.toggleUnblockById(userId);
        return res.json(status);
    } catch (error) {
        console.error(error); // Логирование ошибки в консоль для дебага
        return res.status(500).json({ message: 'Ошибка при разблокировке пользователя', error: error.message });
    }
};
exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        await userService.deleteUserById(userId);
        return res.json({ message: 'Пользователь успешно удален' });
    } catch (error) {
        next(error);
    }
};
