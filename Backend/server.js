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
    loginKey = req.session.adminLogin;
    if (loginKey == null){
        loginKey = false;
    }
    if (loginKey){
        res.render('addproduct')
    }
    else{
        req.flash("error", "Permission Denied");
        res.redirect('/');
    }
});

app.get('/adduser', function(req, res){
    loginKey = req.session.adminLogin;
    if (loginKey == null){
        loginKey = false;
    }
    if (loginKey){
        res.render('adduser');
        app.post('/au', (req, res)=>{
                var username = req.body.username;
                var password = req.body.password;
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
                        res.redirect('/usermenu');
                });
            }
        });
        
    });
    }
    else{
        req.flash("error", "Permission Denied");
        res.redirect('/');
    }

});

app.get('/adminhome', function(req, res){
    loginKey = req.session.adminLogin;
    if (loginKey == null){
        loginKey = false;
    }
    if (loginKey){
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
                if (adminkey == 'adminkey'){
                    req.session.adminLogin = true;
                    res.redirect('/adminhome');
                }
            } else {
                req.flash('error', 'Invalid credentials, please try again');
                res.redirect('/adminlogin');
            }
        })
    })
});

app.get('/blacklist', function(req, res){
    loginKey = req.session.adminLogin;
    if (loginKey == null){
        loginKey = false;
    }
    if (loginKey){
        res.render('blacklist');
        app.post('/blklist', (req, res)=>{
            var username = req.body.username;
            const checker = 'select * from users where username = "' + username + '";';
            connection.query(checker, function(err, result){
                if (err) throw err;
                if (result.length > 0){
                    let sql = 'update users set blacklistFlag = 1 where username = "' + username + '";';
                    connection.query(sql, function(err, result){
                        if (err) throw err;
                        req.flash('success', 'User has been blacklisted');
                        res.redirect('/usermenu');
                    });
                }
                else{
                    req.flash('error', 'User does not exist');
                    res.redirect('/blacklist');
                }

            });
        });
    }
    else{
        req.flash("error", "Permission Denied");
        res.redirect('/');
    }
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
        req.flash('error', "Please login first");
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
        req.flash('error', "Please login first");
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
        // req.flash('error', "Please login first");
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
  
    loginKey = req.session.adminLogin;
    if (loginKey == null){
        loginKey = false;
    }
    if (loginKey){
        res.render('edituser');
        app.post('/edit', (req, res)=>{
                var username = req.body.username;
                var password = req.body.password;
                var balance = req.body.balance;
                var Tusername = req.body.Tusername;
                var imgsrc = req.files.profilepic;
                var filePath = req.files.profilepic.name;
            
                if (filePath!= null){
                    filePath = '/'+ filePath
                }
                //check if user exists
                check = 'select * from users where username = "' + Tusername + '";';
                connection.query(check, function(err, result){
                    if (err) throw err;
                    if (result.length == 0){
                        req.flash('error', 'Username does not exist, please try again');
                        res.redirect('/edituser');
                    }
                    else{
                        let check = 'select username from users where username = "' + username + '";';
                        connection.query(check, function(err, result){
                            if (err) throw err;
                            if (result.length > 0){
                                req.flash('error', 'Username already exists, please try again');
                                res.redirect('/edituser');
                            }
                            else{
                                let sql = 'update users set username = "'+username+'", password = "'+password+'", balance = '+balance+', propicURL = "./image/'+filePath+'" where username = "' + Tusername + '";';
                                connection.query(sql, function(err, result){
                                    if (err) throw err;
                                    imgsrc.mv('../style/image/'+filePath, function(err){
                                        if (err) throw err;
                                    });
                                    req.flash('success', 'User updated successfully');
                                    res.redirect('/usermenu');
                                });
                            }
                        });
                    }
            });

        });
    

    
    }else{
        req.flash("error", "Permission Denied");
        res.redirect('/');
    }
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
                let blklistFlag = result[0].blacklistFlag;
                console.log(blklistFlag);
                if(blklistFlag == 1) {
                    req.flash('error', 'You were blacklisted from the store');
                    res.redirect('/login');
                }
                else{
                    req.session.loggedin = true;
                    req.session.uid = result[0].UID;
                    console.log("history link = ", historyLink);
                    res.redirect(historyLink);
                }
            } 
            else {
                req.flash('error', 'Invalid credentials, please try again');
                res.redirect('/login');
            }
        })
    })
});


app.get('/payment', async function(req, res){
    if (req.session.loggedin){
        const userID = req.session.uid;
    
        // Wrap the query in a function that returns a Promise
        function queryAsync(query) {
            return new Promise((resolve, reject) => {
                connection.query(query, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
        }
    
        // Use an async function to handle the queries
        async function handleQueries() {
            //let totalcost = await queryAsync('SELECT SUM(price * count) AS total FROM shopcart, product WHERE shopcart.productID = product.productID AND checkedProd=1 AND UID =' + userID);
            
            let sql = 'select * from (select shopcart.productID, checkedProd, pName, price, count, (price*count) as ssum, (SELECT SUM(price * count) FROM shopcart, product WHERE shopcart.productID = product.productID AND checkedProd=1 AND UID =' + userID + ') AS total from shopcart, product where shopcart.productID = product.productID and UID='+ userID +') as a where checkedProd=1;';
            
            let results = await queryAsync(sql);
            console.log("payment: ", results);
            console.log("userID: ", userID);
            let totalcost = results[0].total;
            let productIDs = results.map(a => a.productID);
            let count = results.map(a => a.count);
            let prodsum = results.map(a => a.ssum);
            return { totalcost, productIDs, count, prodsum, results };
        }
        let { results } = await handleQueries(req.session.uid);
        res.render('payment', {action: 'list', checkedProdData: results});
            app.post('/pay', async (req, res)=>{
                let { totalcost, productIDs, count, prodsum, results } = await handleQueries(req.session.uid);
                let checkBalance = 'select balance from users where UID=' + userID + ';';
                let balance = await queryAsync(checkBalance);
                if(balance[0].balance < totalcost){
                    req.flash('error', 'Insufficient balance, please top up or remove some items from cart.');
                    req.flash('error', 'redirecting to cart...')
                    res.redirect('/cart');
                }
                else{
                    let updateBalance = 'UPDATE users SET balance = balance - ' + totalcost + ' WHERE UID=' + userID;
                    await queryAsync(updateBalance);
                    for (let i = 0; i < productIDs.length; i++) {
                        let updateStock = 'UPDATE product SET quantity = quantity - ' + count[i] + ' WHERE productID=' + productIDs[i];
                        await queryAsync(updateStock);
            
                        let insert = 'INSERT INTO transaction (UID, productID, sum, count) VALUES (' + userID + ',' + productIDs[i] + ',' + prodsum[i] + ', '+count[i]+')';
                        await queryAsync(insert);
                    }
                    let deleteCart = 'DELETE FROM shopcart WHERE checkedProd=1 AND UID = ' + userID;
                    await queryAsync(deleteCart);
            
                    let result = await queryAsync('SELECT balance FROM users WHERE UID=' + userID);
                    req.flash('success', 'Payment successful, new balance = ' + result[0].balance);
                    res.redirect('/cart');
                }
            });
        handleQueries().catch(err => console.error(err));
    }
    else{
        console.log("No payment session yet. Please login.");
        res.redirect('/login');
    }
});



app.get('/product/:id', async (req, res) => {
    const product = await getProductById(req.params.id);
    let login = false;
    let check = ['false'];
    if (req.session.loggedin == true) {
        login = true;
        let sql = 'select count from SHOPCART where productID = ' + req.params.id + ' and UID = ' + req.session.uid + ';';
        connection.query(sql, function(err, result){
            if (err) throw err;
            // console.log(product);
            // console.log(result);
            check[0] = result;
        });
    }
    // else {
    //     console.log(product);
    //     res.render('product', { products: product, loggedin: login, check: false});
    // }
    let sql2 = 'select commentID, rating, date, content, UID, username, propicURL from REVIEW inner join USERS using(UID) where productID=' + req.params.id+ ';';
    connection.query(sql2, function(err, result2){  
        if (err) throw err;
        console.log(result2);
        // res.render('product', { products: product, loggedin: login, check: check[0], review: result2});
        let sqlr1 = 'select count(*) as count1 from REVIEW where productID = ' + req.params.id + ' and rating = 1;';
        let sqlr2 = 'select count(*) as count2 from REVIEW where productID = ' + req.params.id + ' and rating = 2;';
        let sqlr3 = 'select count(*) as count3 from REVIEW where productID = ' + req.params.id + ' and rating = 3;';
        let sqlr4 = 'select count(*) as count4 from REVIEW where productID = ' + req.params.id + ' and rating = 4;';
        let sqlr5 = 'select count(*) as count5 from REVIEW where productID = ' + req.params.id + ' and rating = 5;';
        
        async.parallel({
            res1: function(callback){
                connection.query(sqlr1, function(err, resr1){
                    if (err) throw err;
                    callback(null, resr1[0].count1);
                });
            },
            res2: function(callback){
                connection.query(sqlr2, function(err, resr2){
                    if (err) throw err;
                    callback(null, resr2[0].count2);
                });
            },
            res3: function(callback){
                connection.query(sqlr3, function(err, resr3){    
                    if (err) throw err;
                    callback(null, resr3[0].count3);
                });
            },
            res4: function(callback){
                connection.query(sqlr4, function(err, resr4){
                    if (err) throw err;
                    callback(null, resr4[0].count4);
                });
            },
            res5: function(callback){
                connection.query(sqlr5, function(err, resr5){    
                    if (err) throw err;
                    callback(null, resr5[0].count5);
                });
            }
        }, function(err, result){
            if (err) throw err;
            let ratingCount = [];
            ratingCount.push(result.res5);
            ratingCount.push(result.res4);
            ratingCount.push(result.res3);
            ratingCount.push(result.res2);
            ratingCount.push(result.res1);
            console.log(ratingCount);
            let totalReview = 0;
            let totalStars = 0;
            ratingCount.forEach((rating, index) => {
                totalReview += rating;
                totalStars += rating * (5-index);
            });
            let averageRating = 0;
            if (totalReview != 0)
                averageRating = totalStars / totalReview;
            res.render('product', { products: product, loggedin: login, check: check[0], review: result2, ratingList: ratingCount, ratingAvg: averageRating, totalReview: totalReview});
        });
        // res.render('product', { products: product, loggedin: login, check: check[0], review: result2, ratingList: ratingCount});
    });
        
                
});

app.post('/comment', function(req, res){
    if (req.session.loggedin){
        const userID = req.session.uid;
        const productID = req.body.productID;
        let rating = 1;
        const date = new Date().toLocaleDateString();
        const content = req.body.review;
        const stars = req.body.star;
        if (stars) {
            rating = stars.length;
        }
        // console.log("productID: ", productID);
        // console.log("userID: ", userID);
        // console.log("date: ", date);
        // console.log("content: ", content);
        // console.log("rating: ", rating);
        let sql1 = 'select count(*) as count from TRANSACTION where UID=' + userID + ' and productID=' + productID + ';';
        connection.query(sql1, function(err, result){
            if (err) throw err;
            console.log("result: ", result[0].count == 0);
            if (result[0].count == 0){
                req.flash('error', 'You have not purchased this product yet, please purchase before leaving a review');
                res.redirect('/product/' + productID);
            } else {
                let sql2 = 'insert into REVIEW(rating, UID, productID, date, content) values(' + rating + ',' + userID + ',"' + productID + '","' + String(date) + '","' + String(content) + '");';
                connection.query(sql2, function(err, result){
                    if (err) throw err;
                    console.log("review added");
                });
                res.redirect('/product/' + productID);
            }
        });
        
    } else {
        req.flash('error', "Please login first");
        res.redirect('/login');
    }
    
});

app.get('/rmuser', function(req, res){
    loginKey = req.session.adminLogin;
    if (loginKey == null){
        loginKey = false;
    }
    if (loginKey){
        res.render('rmuser');
        app.post('/rmv', (req, res)=>{
            var username = req.body.username;
            const checker = 'select * from users where username = "' + username + '";';
            connection.query(checker, function(err, result){
                if (err) throw err;
                if (result.length > 0){
                    let sql = 'delete from users where username = "' + username + '";';
                    connection.query(sql, function(err, result){
                        if (err) throw err;
                        req.flash('success', 'User removed successfully');
                        res.redirect('/usermenu');
                    });
                }
                else{
                    req.flash('error', 'User does not exist');
                    res.redirect('/rmuser');
                }

            });
        });
    }
    else{
        req.flash("error", "Permission Denied");
        res.redirect('/');
    }
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
    loginKey = req.session.adminLogin;
    if (loginKey == null){
        loginKey = false;
    }
    if (loginKey){
        let sql = 'SELECT * FROM product;';
        connection.query(sql, function(err, results){
        if (err) throw err;
        res.render('storemanage', {action: 'list', products: results});
    });
    }
    else{
        req.flash("error", "Permission Denied");
        res.redirect('/');
    }
});

app.get('/usermenu', function(req, res){
    loginKey = req.session.adminLogin;
    if (loginKey == null){
        loginKey = false;
    }
    if (loginKey){
        res.render('usermenu')
    }
    else{
        req.flash("error", "Permission Denied");
        res.redirect('/');
    }
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

        let sql = 'SELECT username, propicURL, balance FROM users WHERE UID = '+userID+';';
        
        connection.query(sql, function(err, results){
            if (err) throw err;
            let sql_2 = 'SELECT p.productID, p.imageURL,  p.pName,  p.price,SUM(t.count) AS totalCount  ,SUM(t.sum) AS totalSum  FROM transaction t INNER JOIN  product p ON t.productID = p.productID WHERE  t.UID = '+ userID+' GROUP BY t.productID;'
            //let sql_2 = 'SELECT  p.productID, p.imageURL, p.pName, p.price,t    FROM transaction t JOIN product p ON t.productID = p.productID WHERE t.UID = '+ userID+'';
            connection.query(sql_2, function(err, result){
                if (err) throw err;
                res.render('userprofile', {name: results[0].username,picpath : results[0].propicURL, balance : results[0].balance ,userid: userID, products: result});
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
