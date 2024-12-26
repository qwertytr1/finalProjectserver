const UserDto = require('../dtos/user-dto.js');
const { User } = require('../models/index.js');
const {TokenSchema} = require('../models/token-model.js');
const TokenService = require('./token-service.js');
const bcrypt = require('bcryptjs');
const tokenService = require('./token-service.js');
const ApiError = require('../exceptions/api-error.js');
class AuthService {
    async register(username, email, password, language, theme, role, isBlocked) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw ApiError.BadRequest('Email is already in use.');
        }

        const newUser = await User.create({
            username,
            email,
            password_hash: hashedPassword,
            language,
            theme,
            role,
            isBlocked,
        });

        const userDto = new UserDto(newUser);
        const tokens = TokenService.generateAccessToken({ ...userDto });
        return { ...tokens, user: userDto };
    }
    async login(email, password) {

        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw ApiError.BadRequest('User not found');
        }

        const isPassEquals = await bcrypt.compare(password, user.password_hash);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Invalid password');
        }

        const userDto = new UserDto(user);
        const tokens = TokenService.generateAccessToken({ ...userDto });

        return { ...tokens, user: userDto };
    }
    async logout(refreshToken) {
        const token = await TokenService.removeToken(refreshToken);
        return token;
     }
    async refreshAccessToken(accessToken) {
        if (!accessToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            throw ApiError.UnauthorizedError();
        }
        const user = await User.findOne({ where: { id: userData.id } });
        const userDto = new UserDto(user);
        const tokens = tokenService.generateAccessToken({...userDto});
        return {...tokens, user: userDto}
    }
}


module.exports = new AuthService();
