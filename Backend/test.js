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
const pool = require('./dbPool');
const initSQL = fs.readFileSync('./initializer.sql').toString();
test1 = 'select * from product;';
test2 = 'select * from category';
async function executequery(query){
    try{
        var result = await pool.query(query);
        return result;
    }
    catch(err){
        throw err;
    }
}

r1 = executequery(initSQL);
r2 = executequery(test1);
r3 = executequery(test2);
console.log(r1);
console.log(r2);


app.set('views', '../views');
app.use(express.static(__dirname+'/../style'));

app.set('view engine', 'ejs');
app.get('/', function(req, res){
    res.render('homepage');
});

app.listen(5500, function() {
    console.log('Server is running on port 5500');
}); 
