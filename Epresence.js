const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./database');

const Epresence = sequelize.define('Epresence', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    id_users: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    is_approve: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    waktu: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },

}, {
    tableName: 'epresences', 
    timestamps: false 
});

module.exports = Epresence;
