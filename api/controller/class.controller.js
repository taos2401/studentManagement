var asyncSQL = require("../../model/asyncQuery");

module.exports = {
  getAllClass: async (req, res) => {
    try {
      let classes = await asyncSQL(`SELECT user.name AS name_teacher, user.email AS email_teacher, user.image AS image_teacher,user.id AS id_teacher, class.id AS id_class,
        class.name AS name_class,class.info AS info_class,class.number_student AS numberstudent_class FROM user JOIN class ON class.id_teacher = user.id`);
      if (req.data.role == "student")
        res.status(200).json({ classes: classes });
      else
        res
          .status(200)
          .json({ classes: classes, role: true, userLogin: req.data.id });
    } catch (err) {
      res.status(404).json({ success: false });
    }
  },

  getAllHomework: async (req, res) => {
    let idUserLogin = req.data.id;
    let idCLass = req.params.id;
    try {
      let homeworks = await asyncSQL(
        `SELECT * FROM class_homework WHERE id_class="${idCLass}"`
      );
      if (req.data.role == "student") {
        let checkHWDone = await asyncSQL(
          `SELECT id_homework FROM student_homework WHERE id_student="${idUserLogin}"`
        );
        let idHwDone = [];
        for (let i = 0; i < checkHWDone.length; i++)
          idHwDone.push(checkHWDone[i].id_homework);
        console.log(idHwDone);
        res
          .status(200)
          .json({ homeworks: homeworks, role: false, hwDoneList: idHwDone });
      } else {
        let checkClassOfTeacher = await asyncSQL(
          `SELECT id_teacher FROM class WHERE id="${idCLass}"`
        );
        if (checkClassOfTeacher[0].id_teacher == idUserLogin) {
          res
            .status(200)
            .json({ homeworks: homeworks, role: true, userLogin: true });
        } else
          res
            .status(200)
            .json({ homeworks: homeworks, role: true, userLogin: false });
      }
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  },
};
