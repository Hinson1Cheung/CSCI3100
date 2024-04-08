const express = require("express");
const app = express();
const path = require('path');
//const homePage = require("./Frontend/index.html");



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
app.set('views', './views');
app.use(express.static(__dirname+'/styles'));
app.set('view engine', 'ejs');
app.get('/', function(req, res){
    res.render('homepage');
});

app.listen(5500, function() {
    console.log('Server is running on port 5500');
}); 
