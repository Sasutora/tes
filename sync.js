const sequelize = require('./database');
const User = require('./user');
const Epresence = require('./Epresence');
sequelize.sync({ force: false }) 
    .then(() => {
        console.log("Tabel telah dibuat atau sudah ada.");
    })
    .catch(err => console.error("Gagal membuat tabel:", err))
    .finally(() => sequelize.close());