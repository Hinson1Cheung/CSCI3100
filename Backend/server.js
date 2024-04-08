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
app.set('views', '../views');
app.use(express.static(__dirname+'/../style'));

app.set('view engine', 'ejs');
app.get('/', function(req, res){
    res.render('homepage');
});

//button redirect code
app.get('/addproduct', function(req, res){
    res.render('addproduct')
});

app.get('/adduser', function(req, res){
    res.render('adduser')
});

app.get('/adminhome', function(req, res){
    res.render('adminhome')
});

app.get('/adminlogin', function(req, res){
    res.render('adminlogin')
});

app.get('/blacklist', function(req, res){
    res.render('blacklist')
});

app.get('/cart', function(req, res){
    res.render('cart')
});

app.get('/catalogue', function(req, res){
    res.render('catalogue')
});

app.get('/edituser', function(req, res){
    res.render('edituser')
});

app.get('/homepage', function(req, res){
    res.render('homepage')
});

app.get('/login', function(req, res){
    res.render('login')
});

app.get('/payment', function(req, res){
    res.render('payment')
});

app.get('/product', function(req, res){
    res.render('product')
});

app.get('/rmuser', function(req, res){
    res.render('rmuser')
});

app.get('/signup', function(req, res){
    res.render('signup')
});

app.get('/storemanage', function(req, res){
    res.render('storemanage')
});

app.get('/usermenu', function(req, res){
    res.render('usermenu')
});

app.get('/viewuser', function(req, res){
    res.render('viewuser')
});
//end of redirect

app.listen(5500, function() {
    console.log('Server is running on port 5500');
}); 
