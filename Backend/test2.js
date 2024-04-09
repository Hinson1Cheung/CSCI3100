const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("express-flash");
const path = require('path');
const parser = require('body-parser');
const pool = require('./dbPool.js');
const { getProductById } = require('./poolQuery.js');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './style/images');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });
//const homePage = require("./Frontend/index.html");
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
}));

app.use(flash());

const mysql = require("mysql2");
const fs = require("fs");
let connection = mysql.createConnection({
    multipleStatements: true, 
    host: 'localhost',
    user: 'root',
    password: 'password'
    // infileStreamFactory: ()=>fs.createReadStream('Product.csv'), 
    // infileStreamFactory: ()=>fs.createReadStream('Category.csv')
});

// const initSQL = fs.readFileSync('./initializer.sql').toString();
const initSQL1 = fs.readFileSync('./initializer1.sql').toString();
const initSQL2 = fs.readFileSync('./initializer2.sql').toString();



connection.connect(function(err){
    if (err) throw err;
    // init for Product table
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

    // connection.end();
});
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(__dirname+'/../style'));
app.use(express.json());

app.set('view engine', 'ejs');
app.get('/', function(req, res){
    let sql = 'SELECT * FROM product ORDER BY rating DESC LIMIT 12'; // Query to get top 12 highest-rated products
    connection.query(sql, (err, result) => {
      if (err) throw err;
      res.render('homepage', { products: result ,loggedin: req.session.loggedin}); // Pass product data to EJS template
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
    if (req.session.loggedin){
        userID = req.session.uid;
        let sql = 'select productID, count, a.total, SHOPCART.UID, pName, price, imageURL from SHOPCART inner join PRODUCT using(productID), (select SHOPCART.UID, COUNT(*) as total from SHOPCART group by UID) as a where SHOPCART.UID=' + String(userID) + ' order by productID ASC;';
        connection.query(sql, function(err, results){
        if (err) throw err;
        res.render('cart', {action: 'list', cartData: results});
        // console.log(results);
        // console.log(req.session.uid);
    });
    // connection.end();
    }
    else{
        res.redirect('/login');
    }
});

app.get('/catalogue', function(req, res){
    let sql = 'SELECT * FROM product';
    connection.query(sql, (err, result) => {
      if (err) throw err;
      res.render('catalogue', { products: result });
    });
});

app.get('/edituser', function(req, res){
    res.render('edituser')
});

app.get('/homepage', function(req, res){
    let sql = 'SELECT * FROM product ORDER BY rating DESC LIMIT 12'; // Query to get top 12 highest-rated products
    connection.query(sql, (err, result) => {
      if (err) throw err;
      res.render('homepage', { products: result ,loggedin: req.session.loggedin}); // Pass product data to EJS template
    });
});

app.get('/login', function(req, res){
    res.render('login');
    app.post('/log', (req, res)=>{
        var username = req.body.username;
        var password = req.body.password;
        query = 'select * from users where username = "' + username + '" and password = "' + password + '";';
        connection.query(query, function(err, result){
            if (err) throw err;
            if (result.length > 0){
                req.session.loggedin = true;
                req.session.uid = result[0].UID;
                res.redirect('/');
            } else {
                req.flash('error', 'Invalid credentials, please try again');
                res.redirect('/login');
            }
        })
    })
});


app.get('/payment', function(req, res){
    res.render('payment')
});

app.get('/product/:id', async (req, res) => {
    const product = await getProductById(req.params.id);
    res.render('product', { products: product });
});

app.get('/rmuser', function(req, res){
    res.render('rmuser')
});

app.get('/signup', function(req, res){
    res.render('signup');
    app.post('/reg', (req, res)=>{
        var username = req.body.username;
        var password = req.body.password;
        var password1 = req.body.password1;
        var balance = req.body.balance;
        var imagePath = req.body.profilepic;
        //check if user already exists
        check = 'select * from users where username = "' + username + '";';
        connection.query(check, function(err, result){
            if (err) throw err;
            if (result.length > 0){
                req.flash('error', 'Username already exists, please try again');
                res.redirect('/signup');
            } else {
                if (password == password1){
                    query = 'insert into users (username, password, balance, propicURL) values ("' + username + '", "' + password + '", ' + balance + ', "./image/' + imagePath + '");';
                    console.log("query = ", query);
                    connection.query(query, function(err, result){
                        if (err) throw err;
                        req.flash('success', 'Account created successfully');
                        res.redirect('/login');
                    });
                } else {
                    req.flash('error', 'Passwords do not match, please try again');
                    res.redirect('/signup');
                }
            }
        })
    })
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

app.get('/userprofile', function(req, res){
    res.render('userprofile')
})

app.get('/api/products', async (req, res) => {
    const [products] = await pool.query('SELECT * FROM product');
    res.json(products);
});

//end of redirect

app.listen(5500, function() {
    console.log('Server is running on port 5500');
}); 
