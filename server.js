const express = require("express");
const app = express();
//const homePage = require("./Frontend/index.html");
//const mysql = require("mysql2");
const path = require('path');

app.use(express.static(path.join(__dirname, 'Frontend')));

/*app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});

app.get('/homepage.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'homepage.css'));
});

app.get('/homepage.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'homepage.js'));
}); */
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
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
}); 