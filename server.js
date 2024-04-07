const express = require("express");
const app = express();
const homePage = require("./Frontend/index.html");
const mysql = require("mysql2");

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './Frontend/index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});