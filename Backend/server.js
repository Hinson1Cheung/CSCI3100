const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("express-flash");
const path = require('path');
const parser = require('body-parser');
const pool = require('./dbPool.js');
const uploader = require('express-fileupload');
const { getProductById } = require('./poolQuery.js');
const multer = require('multer');
const async = require('async');

app.use(uploader());


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
const fileUpload = require("express-fileupload");
const { name } = require("ejs");
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
    res.render('adduser');
    app.post('/au', (req, res)=>{
        var username = req.body.username;
        var password = req.body.password;
        var password1 = req.body.password1;
        var balance = req.body.balance;
        var imgsrc = req.files.profilepic;
        var filePath = req.files.profilepic.name;
       
        if (filePath!= null){
            filePath = '/'+ filePath
        }
        //check if user already exists
        check = 'select * from users where username = "' + username + '";';
        connection.query(check, function(err, result){
            if (err) throw err;
            if (result.length > 0){
                req.flash('error', 'Username already exists, please try again');
                res.redirect('/adduser');
            }
            else{
                let sql = 'insert into users (username, password, balance, propicURL) values ("' + username + '", "' + password + '", ' + balance + ', "./image/' + filePath + '");';
                connection.query(sql, function(err, result){
                if (err) throw err;
                imgsrc.mv('../style/image/'+filePath, function(err){
                    if (err) throw err;
                });
                req.flash('success', 'User added successfully');
                res.redirect('/adminhome');
        });
            }
        });
        
    });

});

app.get('/adminhome', function(req, res){
    if (req.session.adminLogin){
        res.render('adminhome')
    }
    else{
        req.flash("error", "Permission Denied");
        res.redirect('/');
    }
    
});

app.get('/adminlogin', function(req, res){
    res.render('adminlogin')
    app.post('/adm', (req, res)=>{
        var username = req.body.username;
        var password = req.body.password;
        var adminkey = req.body.key;
        query = 'select * from admins where adminname = "' + username + '" and password = "' + password + '";';
        connection.query(query, function(err, result){
            if (err) throw err;
            if (result.length > 0){
                if(adminkey =='adminkey'){
                    req.session.adminLogin = true;
                    res.redirect('/adminhome');
                }
                else{
                    req.flash('error', 'Invalid credentials, please try again');
                    res.redirect('/login');
                }

            } else {
                req.flash('error', 'Invalid credentials, please try again');
                res.redirect('/login');
            }
        })
    })
});

app.get('/blacklist', function(req, res){
    res.render('blacklist')
});

app.get('/cart', function(req, res){
    // res.render('cart');
    if (req.session.loggedin){
        const userID = req.session.uid;
        let sql1 = 'update SHOPCART set checkedProd = 0 where UID=' + userID + ';';
        connection.query(sql1, function(err, result){
            if (err) throw err;
            console.log("sql1:  ", result);
        });
        // let sql = 'select productID, count, a.total, SHOPCART.UID, pName, price, imageURL from SHOPCART inner join PRODUCT using(productID), (select SHOPCART.UID, COUNT(*) as total from SHOPCART group by UID) as a where SHOPCART.UID=' + String(userID) + ' order by productID ASC;';
        let sql = 'select productID, count, a.total, SHOPCART.UID, pName, price, imageURL from SHOPCART inner join PRODUCT using(productID) left join (select UID, COUNT(*) as total from SHOPCART group by UID) as a on SHOPCART.UID=a.UID where SHOPCART.UID=' + String(userID) + ' order by productID ASC;';
        // console.log("sql_cart: ", sql);
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

app.post('/del', (req, res)=>{
    if (req.session.loggedin) {
        const productID = req.body.productID;
        const productNum = req.body.quantity;
        const userID = req.session.uid;
        // console.log("productID: ", productID);
        // console.log("productNum: ", productNum);
        for (let i = 0; i < productID.length; i++){
            let sql1 = 'delete from SHOPCART where productID=' + productID[i] + ' and UID=' + String(userID) + ';';
            // console.log("sql_delete: ", sql1);
            connection.query(sql1, function(err, result){
                if (err) throw err;
                // console.log("sql1:  ", result);
            });
            // let sql2 = 'update PRODUCT set quantity = quantity + ' + productNum[i] + ' where productID=' + productID[i] + ';';
            // connection.query(sql2, function(err, result){
            //     if (err) throw err;
            //     // console.log("sql2:  ", result);
            // }); 
        }
        res.json({success: true});
        if (res.json.success){
            res.redirect('/cart');
        }
    }
    else {
        console.log("Please login first");
        res.redirect('/login');
    }
});

app.post('/delproduct', (req, res)=>{
    const productID = req.body.productID;
    // console.log("productID: ", productID);
    // console.log("productNum: ", productNum);
    for (let i = 0; i < productID.length; i++){
        let sql1 = 'delete from product where productID=' + productID[i] + ';';
        // console.log("sql_delete: ", sql1);
        connection.query(sql1, function(err, result){
            if (err) throw err;
            // console.log("sql1:  ", result);
        });
    }
    res.json({success: true});
    if (res.json.success){
        res.redirect('/storemanage');
    }
});

app.post('/checkout', (req, res)=>{
    if (req.session.loggedin) {
        const userID = req.session.uid;
        const productID = req.body.productID;
        
        for (let i = 0; i < productID.length; i++){
            let sql = 'update SHOPCART set checkedProd = 1 where productID=' + productID[i] + ' and UID=' + String(userID) +';';
            connection.query(sql, function(err, result){
                if (err) throw err;
            });
        }
        let debug = 'select * from shopcart where UID=' + userID + ';';
        connection.query(debug, function(err, result){
            if (err) throw err;
            console.log("debug: ", result);
        });
        //delete all records where checkedProd = 0
        // let rm = 'delete from shopcart where checkedProd = 0 and UID=' + userID + ';';
        // connection.query(rm, function(err, result){
        //     if (err) throw err;
        // });
        // connection.query(remove, function(err, result){
        //     if (err) throw err;
        // });
        // res.json({success: true});
    }else {
        console.log("Please login first");
        res.redirect('/login');
    }
});

// app.post('/backCart', (req, res)=>{
//     if (req.session.loggedin) {
//         const userID = req.session.uid;
//         const productID = req.body.productID;
//         for (let i = 0; i < productID.length; i++){
//             let sql = 'update SHOPCART set checkedProd = 1 where productID=' + productID[i] + ' and UID=' + String(userID) +';';
//             connection.query(sql, function(err, result){
//                 if (err) throw err;
//             });
//         }
//         res.json({success: true});
//     }else {
//         console.log("Please login first");
//         res.redirect('/login');
//     }
//     // if (res.json.success){
//     //     res.redirect('/cart');
//     // }
// });

app.post('/add', (req, res)=>{
    if (req.session.loggedin) {
        const productID = req.body.productID;
        const productNum = req.body.addCount;
        const userID = req.session.uid;
        // console.log("userID: ", userID);
        // console.log("productID: ", productID);
        // console.log("productNum: ", productNum);

        // initialize sql queries(sql1, sql2, sql3, sql4)
        let sql1 = "select MAX(cartID) as max_id from SHOPCART;";
        let max_id = 0;
        let sql2 = 'select * from SHOPCART where UID=' + String(userID) +  ' and productID='+ String(productID) + ';';
        let sql3 = ''; //dependent on sql2
        //let sql4 = 'update PRODUCT set quantity = quantity - ' + productNum + ' where productID=' + productID + ';';
        
        // async parallel to run sql1, sql2, and sql4 in parallel since they are independent
        async.parallel({
            res1: function(callback){
                // console.time("res1");
                connection.query(sql1, function(err, res1){
                    if (err) { callback(err)}
                    max_id = res1[0]['max_id'];
                    if (max_id == null)
                        max_id = 1;
                    else max_id += 1;
                    // console.log("max_id: ", max_id);
                    // console.log("res1 done ");
                    // console.timeEnd("res1");
                })
            },
            res2: function(callback){
                connection.query(sql2, function(err, res2){
                    // console.time("res2");
                    if (err) { callback(err)}
                    if (res2.length == 0) {
                        sql3 = 'insert into SHOPCART(cartID, count, UID, productID) values(' + max_id + ',' + productNum + ',' + userID + ',' + productID + ');';
                        // console.log("sql3: " ,sql3);
                    }
                    else {
                        sql3 = 'update SHOPCART set count = count + ' + productNum + ' where UID=' + userID + ' and productID=' + productID + ';';
                        // console.log("sql3: " ,sql3);
                    }
                    // console.log("res2 done ");
                    // console.timeEnd("res2");
                })
            },
            //res4: function(callback){
                //connection.query(sql4, function(err, res4){
                    // console.time("res4");
                    //if (err) { callback(err)}
                    // console.log("res4 done ");
                    // console.timeEnd("res4");
                //});
            //}
        });

        // dependent sql query need to be delayed for 10ms
        setTimeout(function() {
            // console.log("sql3: " ,sql3);
            connection.query(sql3, function(err, result){
                if (err) throw err;
            });   
            res.json({success: true});
            if (res.json.success){
                console.log("Product added to cart successfully");
                res.redirect('/cart');
            }
        }, 10);

    }
    else {
        console.log("Please login first");
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

app.get('/search', async (req, res) => {
    const searchTerm = decodeURIComponent(req.query.query);
    const min = req.query.min;
    const max = req.query.max;
    let products;
    if (min == undefined) {
        if (max == undefined) {
            [products] = await pool.query(
                'SELECT * FROM product WHERE pName LIKE ? OR productID = ?',
                [`%${searchTerm}%`, searchTerm]
            );
        } else {
            [products] = await pool.query(
                'SELECT * FROM product WHERE (pName LIKE ? OR productID = ?) AND price <= ?',
                [`%${searchTerm}%`, searchTerm, max]
            );
        }
    } else {
        if (max == undefined) {
            [products] = await pool.query(
                'SELECT * FROM product WHERE (pName LIKE ? OR productID = ?) AND price >= ?',
                [`%${searchTerm}%`, searchTerm, min]
            );
        }
        else {
            [products] = await pool.query(
                'SELECT * FROM product WHERE (pName LIKE ? OR productID = ?) AND price >= ? AND price <= ?',
                [`%${searchTerm}%`, searchTerm, min, max]
            );
        }
    }
    res.render('search', { products: products });
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
    var historyLink = req.header('Referer') || '/';
    app.post('/log', (req, res)=>{
        var username = req.body.username;
        var password = req.body.password;
        query = 'select * from users where username = "' + username + '" and password = "' + password + '";';
        connection.query(query, function(err, result){
            if (err) throw err;
            if (result.length > 0){
                req.session.loggedin = true;
                req.session.uid = result[0].UID;
                console.log("history link = ", historyLink);
                res.redirect(historyLink);
            } else {
                req.flash('error', 'Invalid credentials, please try again');
                res.redirect('/login');
            }
        })
    })
});


app.get('/payment', async function(req, res){
    if (req.session.loggedin){
        const userID = req.session.uid;
       
        // let sql = 'select shopcart.productID, pName, price, count, (price*count) as ssum, (SELECT SUM(price * count) FROM shopcart, product WHERE shopcart.productID = product.productID AND UID = ' + userID + ') AS total from shopcart, product where shopcart.productID = product.productID and UID=' + userID + ';';
        let sql = 'select * from (select shopcart.productID, checkedProd, pName, price, count, (price*count) as ssum, (SELECT SUM(price * count) FROM shopcart, product WHERE shopcart.productID = product.productID AND checkedProd=1 AND UID =' + userID + ') AS total from shopcart, product where shopcart.productID = product.productID and UID='+ userID +') as a where checkedProd=1;';
        const totalcost = await new Promise(function (resolve, reject){
            connection.query(sql, function(err, results){
                if (err) throw err;
                res.render('payment', {action: 'list', checkedProdData: results});
                resolve(results[0].total)
            });
        });
        
        //check and deduct balance from user
        app.post('/pay' ,(req, res)=>{
            const userID = req.session.uid;
            let checkBalance = 'select balance from users where UID = ' + userID + ';';
            connection.query(checkBalance, function(err, result){
                if (err) throw err;
                if (result[0].balance >= totalcost){
                    let updateBalance = 'update users set balance = balance - ' + totalcost + ' where UID = ' + userID + ';';
                    connection.query(updateBalance, function(err, result){
                        if (err) throw err;
                        returnnewbalance = 'select balance from users where UID = ' + userID + ';';
                        connection.query(returnnewbalance, function(err, result){
                            if (err) throw err;
                            req.flash("success", "Payment successful!, new balance: " + result[0].balance);
                            let updateProductQuantity = 'update product, shopcart set product.quantity = product.quantity - shopcart.count where product.productID = shopcart.productID and checkedProd=1 and shopcart.UID = ' + userID + ';';
                            connection.query(updateProductQuantity, function(err, result){
                                if (err) throw err;
                                let deleteCart = 'delete from shopcart where checkedProd=1 and UID = ' + userID + ';';
                                connection.query(deleteCart, function(err, result){
                                    if (err) throw err;
                                    res.redirect('/cart');
                                });
                            });
                        });
                    });
                } else {
                    req.flash("error", "Insufficient balance");
                    res.redirect('/payment');
                }
            });
            
        });
        
    }
    else {
        console.log("No payment session yet. Please login.");
        res.redirect('/login');
    }
});



app.get('/product/:id', async (req, res) => {
    const product = await getProductById(req.params.id);
    let login = false;
    if (req.session.loggedin == true) {
        login = true;
        let sql = 'select count from SHOPCART where productID = ' + req.params.id + ' and UID = ' + req.session.uid + ';';
        connection.query(sql, function(err, result){
            if (err) throw err;
            console.log(product);
            console.log(result);
            res.render('product', { products: product, loggedin: login, check: result});
        });
    }
    else {
        console.log(product);
        res.render('product', { products: product, loggedin: login, check: false});
    }
});

app.get('/rmuser', function(req, res){
    res.render('rmuser')
});

app.get('/signup',(req, res)=>{
    res.render('signup');
    app.post('/reg', (req, res)=>{
        var username = req.body.username;
        var password = req.body.password;
        var password1 = req.body.password1;
        var balance = req.body.balance;
        var imgsrc = req.files.profilepic;
        var filePath = req.files.profilepic.name;
       
        if (filePath!= null){
            filePath = '/'+ filePath
        }
        //check if user already exists
        check = 'select * from users where username = "' + username + '";';
        connection.query(check, function(err, result){
            if (err) throw err;
            if (result.length > 0){
                req.flash('error', 'Username already exists, please try again');
                res.redirect('/signup');
            } else {
                if (password == password1){
                    query = 'insert into users (username, password, balance, propicURL) values ("' + username + '", "' + password + '", ' + balance + ', "./image' + filePath + '");';
                    console.log("query = ", query);
                    connection.query(query, function(err, result){
                        if (err) throw err;
                        imgsrc.mv('../style/image'+filePath, function(err){
                            if (err) throw err;
                        });
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
    let sql = 'SELECT * FROM product;';
    connection.query(sql, function(err, results){
    if (err) throw err;
    res.render('storemanage', {action: 'list', products: results});
    });
});

app.get('/usermenu', function(req, res){
    res.render('usermenu')
});

app.get('/viewuser', function(req, res){
    let sql = 'SELECT * FROM users;';
    connection.query(sql, (err, result) => {
      if (err) throw err;
      res.render('viewuser', { products: result });
    });

}
);


app.get('/userprofile', function(req, res){

    if (req.session.loggedin){
        //const userID = req.session.uid;
        const userID = req.session.uid;

        let sql = 'SELECT username, propicURL FROM users WHERE UID = '+userID+';';
        
        connection.query(sql, function(err, results){
            if (err) throw err;
            let sql_2 = 'SELECT  p.productID, p.imageURL, p.pName, p.price    FROM transaction t JOIN product p ON t.productID = p.productID WHERE t.UID = '+ userID+'';
            connection.query(sql_2, function(err, result){
                if (err) throw err;
                res.render('userprofile', {name: results[0].username,picpath : results[0].propicURL ,userid: userID, products: result});
            })

        })

    }
    else {
        console.log("No login session yet. Please login.");
        res.redirect('/login');
    }

}
);


app.get('/api/products', async (req, res) => {
    const [products] = await pool.query('SELECT * FROM product');
    res.json(products);
});

//end of redirect

app.listen(5500, function() {
    console.log('Server is running on port 5500');
}); 
