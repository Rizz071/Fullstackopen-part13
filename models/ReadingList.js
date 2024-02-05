const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')


class ReadingList extends Model { }
ReadingList.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'user', key: 'id' },
    },
    blogId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'blog', key: 'id' },
    },
    unread: {
        type: DataTypes.BOOLEAN,
        default: true,
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'reading_list'
})


module.exports = ReadingList