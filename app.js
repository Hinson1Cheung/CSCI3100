var mysql = require("mysql2");
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password'
});

SQL_createDB = "CREATE DATABASE IF NOT EXISTS ShopDB; ";
SQL_masterDB = "CREATE DATABASE IF NOT EXISTS Master; " ;
SQL_UseDB = "USE ShopDB; ";
SQL_UseMaster = "USE Master; ";
SQL_createTest = "CREATE TABLE IF NOT EXISTS Test(TID INT PRIMARY KEY); ";
SQL_dropTest = "DROP TABLE Test; ";
SQL_dropDB = "DROP DATABASE ShopDB; ";
SQL_insertPID = "INSERT INTO Test VALUES (1233); "
SQL_showPID = "SELECT * FROM Test; "
connection.connect(function(err){
    if (err) throw err;
    console.log("Connected to Database");

    /*Creates Shop DB database*/
    connection.query(SQL_createDB, function(err){
        if (err) throw err;
        console.log("Database created\n ");
    });

    /*Creates Shop DB database*/
    connection.query(SQL_masterDB, function(err){
        if (err) throw err;
        console.log("Database master created\n ");
    });

    /*Use Database*/
    connection.query(SQL_UseDB, function(err){
        if (err) throw err;
        console.log("Now using database Shop DB\n");
    });

    /*Create Table Test*/
    connection.query(SQL_createTest, function(err){
        if (err) throw err;
        console.log("Created table test\n");
    });

    /*Insert into test*/
    connection.query(SQL_insertPID, function(err){
        if (err) throw err;
        console.log("Inserted values into test\n");
    });

    /*Show values from test*/
    connection.query(SQL_showPID, function(err, result, fields){
        if (err) throw err;
        console.log("Contents of table test: \n");
        console.log(result);
    });

    /*Drop table test*/
    connection.query(SQL_dropTest, function(err){
        if (err) throw err;
        console.log("Now using database\n");
    });

    /*Use Master DB*/
    connection.query(SQL_UseMaster, function(err){
        if (err) throw err;
        console.log("Now using database Master\n");
    });
    

    connection.end();
});


