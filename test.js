const mysql = require("mysql2");
const fs = require("fs");

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password'
});

