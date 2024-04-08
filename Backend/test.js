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
const fs = require("fs");
const connection = require('./dataBase')

const initSQL = fs.readFileSync('./initializer.sql').toString();
test1 = 'select * from product;';
test2 = 'select * from category'

connection.query(initSQL, function(err){
    if (err) throw err;
    console.log("AN SQL STAEMENT HAS JUST RUN");
   
});

connection.query(test1, function(err, result){
    if (err) throw err;
    console.log("AN SQL STAEMENT HAS JUST RUN: TEST1");
    
});
console.log("results = "+res);
connection.query(test2, function(err, result){
    if (err) throw err;
    console.log("AN SQL STAEMENT HAS JUST RUN: TEST2");
    
});

connection.end();

app.set('views', '../views');
app.use(express.static(__dirname+'/../style'));

app.set('view engine', 'ejs');
app.get('/', function(req, res){
    res.render('homepage');
});

app.listen(5500, function() {
    console.log('Server is running on port 5500');
}); 
