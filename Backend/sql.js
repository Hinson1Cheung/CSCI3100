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
    console.log(result);
});

connection.query(test2, function(err, result){
    if (err) throw err;
    console.log("AN SQL STAEMENT HAS JUST RUN: TEST2");
    console.log(result);
});

connection.end();

