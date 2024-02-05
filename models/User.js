const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')


class User extends Model { }
User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    username: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    is_disabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'user'
})


module.exports = User