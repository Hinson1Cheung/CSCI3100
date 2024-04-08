const mysql = require("mysql2");
const fs = require("fs");
const connection = mysql.createConnection({
    multipleStatements: true, 
    host: 'localhost',
    user: 'root',
    password: 'password',
    infileStreamFactory: ()=>fs.createReadStream('Product.csv'), 
    infileStreamFactory: ()=>fs.createReadStream('Category.csv')
});

connection.connect(function(err){
    if (err){
        console.log("Console has failed to connect to DataBase");
    }
    else{
        console.log("Database initialized, products retrievd");
    }
})

module.exports = connection;