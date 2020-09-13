var asyncSQL = require("../model/asyncQuery");

module.exports = {
  getClass: async (req, res) => {
    let username = req.data.username;
    let idClass = req.params.id;
    let idUserLogin = req.data.id;
    try {
      if (req.data.role == "student") {
        let checkUser = await asyncSQL(
          `SELECT * FROM class_student WHERE id_student ="${idUserLogin}" AND id_class="${idClass}"`
        );
        if (!checkUser.length) {
          let join = await asyncSQL(
            `INSERT INTO class_student (id_class,id_student,score) VALUES ("${idClass}","${idUserLogin}",0)`
          );
          let numberStudent = await asyncSQL(
            `SELECT number_student FROM class WHERE id="${idClass}"`
          );
          console.log(numberStudent);
          let addNumberStudent = await asyncSQL(
            `UPDATE class SET number_student="${
              numberStudent[0].number_student + 1
            }" WHERE id="${idClass}"`
          );
        }
      }
      //GET USER WAS LOGIN
      let user = await asyncSQL(
        `SELECT id,name,email,phone,image,role FROM user WHERE username="${username}"`
      );
      //GET INFO CLASS AND TEACHER
      let classes = await asyncSQL(`SELECT user.name AS name_teacher, user.email AS email_teacher, user.image AS image_teacher,user.id AS id_teacher,user.phone AS phone_teacher, class.id AS id_class,
        class.name AS name_class,class.info AS info_class,class.number_student AS numberstudent_class FROM class JOIN user ON class.id_teacher = user.id WHERE class.id="${idClass}"`);
      if (!user[0]) res.sendStatus(404);
      else {
        if (req.data.role == "teacher" && user[0].id == classes[0].id_teacher)
          res.render("class", {
            userLogin: user[0],
            classes: classes[0],
            role: true,
            checkteacher: true,
          });
        else if (
          req.data.role == "teacher" &&
          user[0].id != classes[0].id_teacher
        )
          res.render("class", {
            userLogin: user[0],
            classes: classes[0],
            role: true,
            checkteacher: false,
          });
        else {
          res.render("class", {
            userLogin: user[0],
            classes: classes[0],
            role: false,
            checkteacher: false,
          });
        }
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({ success: false });
    }
  },
};
