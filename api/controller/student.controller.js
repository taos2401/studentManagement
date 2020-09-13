const asyncSQL = require("../../model/asyncQuery");

module.exports = {
  sendHomework: async (req, res) => {
    let idUserLogin = req.data.id;
    let idHW = req.params.idhw;
    let idClass = req.params.idclass;
    try {
      if (req.file) {
        let fileHW = `/static/` + req.file.path.split("\\").slice(1).join("/");
        let checkUserInHW = await asyncSQL(
          `SELECT * FROM student_homework WHERE id_student="${idUserLogin}" AND id_homework="${idHW}"`
        );
        if (!checkUserInHW.length) {
          let scoreHW = await asyncSQL(
            `SELECT score FROM class_homework WHERE id="${idHW}"`
          );
          let addScoreStudent = await asyncSQL(
            `UPDATE class_student SET score="${scoreHW[0].score}" AND id_student="${idUserLogin}" AND id_class="${idClass}"`
          );
          if (!addScoreStudent.affectedRows)
            throw new Error("update score student trong lớp lỗi");
          let addHW = await asyncSQL(
            `INSERT INTO student_homework (id_student,id_homework,file,time) VALUES ("${idUserLogin}","${idHW}","${fileHW}","${new Date()}")`
          );
        } else {
          let result = await asyncSQL(
            `UPDATE student_homework SET file="${fileHW}",time="${new Date()}"`
          );
          if (!result) throw new Error("Update homework failed");
        }
        res.status(200).json({
          success: true,
          mess: "Upload homework success",
        });
      } else {
        res.status(200).json({
          success: false,
          mess: "Homework file is required",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(400).json({
        success: false,
        mess: "Something wrong !!!",
      });
    }
  },
};
