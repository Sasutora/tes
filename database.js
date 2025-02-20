const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tes', 'postgres', 'rama', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false, // Matikan logging jika tidak diperlukan
});

module.exports = sequelize;
