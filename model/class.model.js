var db = require("./db");

db.query(
  "CREATE TABLE IF NOT EXISTS class (id INT(10) AUTO_INCREMENT PRIMARY KEY, id_teacher VARCHAR(255),number_student INT)",
  (err) => {
    if (err) console.log(err);
  }
);

db.query(
  "CREATE TABLE IF NOT EXISTS class_student (id_class VARCHAR(255), id_student INT, score INT)",
  (err) => {
    if (err) console.log(err);
  }
);

db.query(
  "CREATE TABLE IF NOT EXISTS class_homework (id INT(10) AUTO_INCREMENT PRIMARY KEY,id_class INT,id_teacher INT, homework VARCHAR(255), score INT)",
  (err) => {
    if (err) console.log(err);
  }
);

db.query(
  "CREATE TABLE IF NOT EXISTS student_homework (id INT(10) AUTO_INCREMENT PRIMARY KEY,id_student INT,id_homework INT)",
  (err) => {
    if (err) console.log(err);
  }
);
