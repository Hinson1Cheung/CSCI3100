const express = require("express");
const app = express();
const session = require("express-session")
const path = require('path');
const parser = require('body-parser');
//const { getProductById } = require('./poolQuery');
//const homePage = require("./Frontend/index.html");

const connection = require("./dataBase");
const fs = require("fs");


// const initSQL = fs.readFileSync('./initializer.sql').toString();
const initSQL1 = fs.readFileSync('./initializer1.sql').toString();
const initSQL2 = fs.readFileSync('./initializer2.sql').toString();



connection.config.infileStreamFactory = () =>fs.createReadStream('Product.csv') 
    connection.query(initSQL1, function(err){
        if (err) throw err;
        console.log("initSQL1 STAEMENT HAS JUST RUN");
    });
// init for Category table
connection.config.infileStreamFactory = () => fs.createReadStream('Category.csv');
connection.query(initSQL2, function(err){
    if (err) throw err;
    console.log("initSQL2 STAEMENT HAS JUST RUN");
});

app.set('views', path.join(__dirname, '../views'));
app.use(express.static(__dirname+'/../style'));
app.use(express.json());

app.set('view engine', 'ejs');
app.get('/', function(req, res){
    let sql = 'SELECT * FROM product ORDER BY rating DESC LIMIT 12'; // Query to get top 12 highest-rated products
    connection.query(sql, (err, result) => {
      if (err) throw err;
      //console.log(result);
      res.render('homepage', { products: result }); // Pass product data to EJS template
    });
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
    // res.render('cart');
    let sql = 'select productID, count, a.total, SHOPCART.UID, pName, price, imageURL from SHOPCART inner join PRODUCT using(productID), (select SHOPCART.UID, COUNT(*) as total from SHOPCART group by UID) as a order by productID ASC;';
    connection.query(sql, function(err, results){
        if (err) throw err;
        res.render('cart', {action: 'list', cartData: results});
        //console.log(results);
        // res.json(results);
    })
    // connection.end();
});

app.get('/catalogue', function(req, res){
    res.render('catalogue')
});

app.get('/edituser', function(req, res){
    res.render('edituser')
});

app.get('/homepage', function(req, res){
    let sql = 'SELECT * FROM product ORDER BY rating DESC LIMIT 12'; // Query to get top 12 highest-rated products
    connection.query(sql, (err, result) => {
      if (err) throw err;
      res.render('homepage', { products: result }); // Pass product data to EJS template
    });
});

app.get('/login', function(req, res){
    res.render('login');
    app.post('/log', (req, res)=>{
        var username = ;
        
        connection.query(query, function(req, res){
            console.log(result);
        })
    })
});

app.get('/payment', function(req, res){
    res.render('payment')
});

app.get('/product', function(req, res){
    res.render('product')
});
/*
app.get('/product/:id', async (req, res) => {
    const product = await getProductById(req.params.id);
    res.render('product', { product });
});*/

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
