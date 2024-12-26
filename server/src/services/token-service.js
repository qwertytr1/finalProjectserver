const jwt = require('jsonwebtoken');
const TokenSchema = require('../models/token-model.js');
const ApiError = require('../exceptions/api-error.js');
class TokenService{
    generateTokens (payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
    return {
        accessToken,
        refreshToken
    }
    }
    generateAccessToken(payload) {
          const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
        return{accessToken}
}
    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
    }
}
 validateRefreshToken(token) {
    try {
        const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        return userData;
    } catch (e) {
        console.error(e);
        return null;
    }
}
async saveToken(userId, refreshToken) {
    console.log("userId:", userId, "refreshToken:", refreshToken); // Debugging logs
    const tokenData = await TokenSchema.findOne({ where: { user_id: userId } });
    if (tokenData) {
        tokenData.refresh_token = refreshToken;
        return tokenData.save();
    }
    const token = await TokenSchema.create({ user_id: userId, refresh_token: refreshToken });
    return token;
}
async findToken(refreshToken) {
    const tokenData = await TokenSchema.findOne({
        where: {
            refresh_token: refreshToken
        }
    });
    return tokenData;
}
}


    module.exports = new TokenService();
