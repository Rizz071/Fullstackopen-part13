const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')


class Session extends Model { }
Session.init({
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: 'user', key: 'id' },
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    expiration: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'session'
})


module.exports = Session