const UserDto = require('../dtos/user-dto.js');
const { User } = require('../models/index.js');
const {TokenSchema} = require('../models/token-model.js');
const TokenService = require('../services/token-service');
const bcrypt = require('bcryptjs');
const tokenService = require('../services/token-service');
const ApiError = require('../exceptions/api-error.js');
class UserService {
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
        const tokens = TokenService.generateTokens({ ...userDto });
        await TokenService.saveToken(userDto.id, tokens.refreshToken);

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
        const tokens = TokenService.generateTokens({ ...userDto });
        await TokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
    }
    async logout(refreshToken) {
        const token = await TokenService.removeToken(refreshToken);
        return token;
     }
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = await tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        console.log(userData)
        const user = await User.findOne({ where: { id: userData.id } });
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async getAllUsers() {
        const users = await User.findAll();
        return users;
    }
    async getUserById(id) {
        const user = await User.findByPk(id);
        if (!user) {
            throw ApiError.BadRequest('User not found');
        }
        return user;
    }

    async editUserById(id, data) {
        const user = await User.findByPk(id);
        if (!user) {
            throw ApiError.BadRequest('Пользователь не найден');
        }
        Object.assign(user, data);
        await user.save();
        return user;
    }

    async toggleBlockByToken(userId) {

   const user = await User.findOne({ where: { id: userId } });

   if (!user) {
       throw new Error('User not found');
   }
   user.isBlocked = true;
   await user.save();

  await TokenService.removeTokenById( userId );

   return { message: 'User blocked and tokens deleted successfully' };
    }
    async toggleUnblockById(userId) {
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            throw new Error('User not found');
        }
        user.isBlocked = false;
        await user.save();
        const userDto = new UserDto(user);
        const tokens = TokenService.generateTokens({ ...userDto });
        await TokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };

         }

    async deleteUserById(userId) {
           const delToken = await TokenService.removeTokenById(userId);
            const delUser = await User.destroy({ where: { id: userId } });
            return delToken, delUser;
    }
}


module.exports = new UserService();