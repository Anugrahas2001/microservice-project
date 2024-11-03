const mongoose = require('mongoose');
const { DB_URL } = require('../config/config');

module.exports = async() => {
console.log(DB_URL,"from db")
    try {
        await mongoose.connect(DB_URL);
        console.log('Db Connected');
        
    } catch (error) {
        console.log('Error ============')
        console.log(error);
        process.exit(1);
    }
 
};

 