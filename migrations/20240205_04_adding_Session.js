const { DataTypes } = require('sequelize')

module.exports = {
    up: async ({ context: queryInterface }) => {
        await queryInterface.createTable('sessions', {
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
        })
        await queryInterface.addColumn('sessions', 'user_id', {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: { model: 'users', key: 'id' },
        })
    },
    down: async ({ context: queryInterface }) => {
        await queryInterface.dropTable('sessions')
    },
}