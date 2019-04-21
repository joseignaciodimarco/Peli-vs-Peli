const mysql = require('mysql');
require('dotenv').config();

let con = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB
});

con.connect(function (err) {
  if (err) throw err;
  console.log("DB Connection successfully!");
});

module.exports = con;