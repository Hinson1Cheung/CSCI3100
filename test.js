const mysql = require("mysql2");
const fs = require("fs");

let connection = mysql.createConnection({
    multipleStatements: true, 
    host: 'localhost',
    user: 'root',
    password: 'password',
    infileStreamFactory: ()=>fs.createReadStream('Product.csv'), 
    infileStreamFactory: ()=>fs.createReadStream('Category.csv')
});

const initSQL = fs.readFileSync('./initializer.sql').toString();



connection.connect(function(err){
    if (err) throw err;
    

    connection.query(initSQL, function(err){
        if (err) throw err;
        console.log("AN SQL STAEMENT HAS JUST RUN");
    });


    connection.end();
})