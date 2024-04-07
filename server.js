const express = require("express");
const app = express();
//const homePage = require("./Frontend/index.html");
//const mysql = require("mysql2");
const path = require('path');

app.use(express.static(path.join(__dirname, 'Frontend')));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});