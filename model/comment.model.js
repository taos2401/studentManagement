const db = require("./db");

let sql =
  "CREATE TABLE IF NOT EXISTS comment (id INT(10) AUTO_INCREMENT PRIMARY KEY, iduser VARCHAR(255), idusercmt VARCHAR(255), cmt VARCHAR(255))";
db.query(sql, (error) => {
  if (error) console.log(error);
});
