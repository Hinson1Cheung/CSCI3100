var mysql = require("mysql2");
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'CSCI3100@123'
});
connection.connect(function(err){
    if (err) throw err;
    console.log("Connected to Database");
});