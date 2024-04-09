const mysql = require('mysql2/promise');
const fs = require("fs");
const pool = mysql.createPool({
    multipleStatements: true, 
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'db',
    infileStreamFactory: ()=>fs.createReadStream('Product.csv'), 
    infileStreamFactory: ()=>fs.createReadStream('Category.csv')
});

module.exports = pool;