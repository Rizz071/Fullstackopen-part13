const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')


class Blog extends Model { }
Blog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            isUrl: true
        }
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            isNumeric: true
        }
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'blog'
})


module.exports = Blog