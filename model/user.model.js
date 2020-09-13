var db = require("./db");

let sql =
  "CREATE TABLE IF NOT EXISTS user (id INT(10) AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), password VARCHAR(255),salt VARCHAR(255), name VARCHAR(255), email VARCHAR(255), phone VARCHAR(255),image VARCHAR(255), role VARCHAR(255))";
db.query(sql, (error) => {
  if (error) console.log(error);
});
