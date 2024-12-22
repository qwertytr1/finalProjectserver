const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TokenSchema = sequelize.define("TokenSchema", {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        field: 'users_id',
    },
    refresh_token: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'refresh_token',
    },
});

module.exports = TokenSchema;
