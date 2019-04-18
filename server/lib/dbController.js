const mysql = require('mysql');

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ji4226603",
  database: 'competencias'
});

con.connect(function (err) {
  if (err) throw err;
  console.log("DB Connection successfully!");
});


module.exports = con;