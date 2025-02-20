const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./database');
const Epresence = require('./Epresence.js');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    npp: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    npp_supervisor: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

}, {
    tableName: 'users', 
    timestamps: false 
});

User.hasMany(Epresence, { foreignKey: 'id_users' });
Epresence.belongsTo(User, { foreignKey: 'id_users' });

module.exports = User;
