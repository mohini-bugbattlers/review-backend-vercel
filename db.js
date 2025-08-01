const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "143.244.128.119",
  user: "root",
  password: "MyTyping#2025",
  database: "azura",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log("Connected to database");
  }
});

module.exports = connection;