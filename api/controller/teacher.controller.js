const asyncSQL = require("../../model/asyncQuery");
const validate = require("../../middleware/validate");

module.exports = {
  saveNewClass: async (req, res) => {
    let { name, info } = req.body;
    name = validate.filterXSS(name);
    info = validate.filterXSS(info);
    let idTeacher = req.data.id;
    if (validate.validateString(name) && validate.validateString(info)) {
      try {
        let newClass = await asyncSQL(
          `INSERT INTO class (id_teacher,name,info,number_student) VALUES ("${idTeacher}","${name}","${info}",0)`
        );
        res.status(200).json({ success: true });
      } catch (err) {
        res.status(400).json({ success: false });
      }
    } else res.json({ success: false, error: "All fields are required" });
  },

  deleteClass: async (req, res) => {
    let idClass = req.params.id;
    try {
      let classDelete = await asyncSQL(
        `DELETE FROM class WHERE id="${idClass}" AND id_teacher ="${req.data.id}"`
      );
      if (classDelete.affectedRows)
        res.status(200).json({ success: true, mess: "Delete successful" });
      else throw new Error("Class not found !");
    } catch (err) {
      console.log(err);
      res.status(400).json({ success: false, mess: "Something wrong !!!" });
    }
  },

  addHomeWork: async (req, res) => {
    let { nameHw, scoreHw } = req.body;
    nameHw = validate.filterXSS(nameHw);
    scoreHw = validate.filterXSS(scoreHw);
    let idClass = req.params.idclass;
    let idTeacher = req.data.id;
    try {
      let checkClass = await asyncSQL(
        `SELECT * FROM class WHERE id="${idClass}" AND id_teacher="${idTeacher}"`
      );
      if (!checkClass[0]) throw new Error("Class not found !");
      if (
        validate.validateString(nameHw) &&
        parseInt(scoreHw) &&
        parseInt(scoreHw) == scoreHw &&
        req.file
      ) {
        let fileHW = `/static/` + req.file.path.split("\\").slice(1).join("/");
        let homework = await asyncSQL(
          `INSERT INTO class_homework (id_class,id_teacher,name,homework,score) VALUES ("${idClass}",${idTeacher},"${nameHw}","${fileHW}",${parseInt(
            scoreHw
          )})`
        );
        res.status(200).json({
          success: true,
          mess: "Add homework success",
        });
      } else {
        res.status(200).json({
          success: false,
          error: "All fields are required, homework grade's must be numeric",
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  deleteHomework: async (req, res) => {
    let idHW = req.params.id;
    try {
      if (idHW) {
        let homework = await asyncSQL(
          `DELETE FROM class_homework WHERE id="${idHW}" AND id_teacher="${req.data.id}"`
        );
        if (homework.affectedRows)
          res.status(200).json({ success: true, mess: "Delete successful" });
        else throw new Error("Teacher not found");
      } else throw new Error("ID not found");
    } catch (err) {
      console.log(err);
      res.status(400).json({ success: false, mess: "Something wrong !!!" });
    }
  },

  editHomework: async (req, res) => {
    let { nameHw, scoreHw } = req.body;
    nameHw = validate.filterXSS(nameHw);
    scoreHw = validate.filterXSS(scoreHw);
    let idHW = req.params.id;
    try {
      console.log(!parseInt(scoreHw));
      if (
        !validate.validateString(nameHw) &&
        !validate.validateString(scoreHw) &&
        !parseInt(scoreHw) &&
        !req.file
      ) {
        return;
      } else if (!parseInt(scoreHw)) {
        res.status(200).json({ success: false, mess: "Grade must be numeric" });
        return;
      } else if (
        validate.validateString(nameHw) &&
        parseInt(scoreHw) &&
        req.file &&
        idHW
      ) {
        var homework = await asyncSQL(
          `UPDATE class_homework SET name="${nameHw}",score="${scoreHw}",homework="${
            `/static/` + req.file.path.split("\\").slice(1).join("/")
          }" WHERE id="${idHW}" AND id_teacher="${req.data.id}"`
        );
      } else if (idHW) {
        var homework = await asyncSQL(`UPDATE class_homework
                SET ${validate.validateString(nameHw) ? `name="${nameHw}"` : ""}
                ${
                  validate.validateString(nameHw) && parseInt(scoreHw)
                    ? ","
                    : ""
                }
                ${parseInt(scoreHw) ? `score="${scoreHw}"` : ""}
                ${req.file && parseInt(scoreHw) ? "," : ""}
                ${
                  req.file
                    ? `homework="${
                        `/static/` +
                        req.file.path.split("\\").slice(1).join("/")
                      }"`
                    : ""
                } 
                WHERE id="${idHW}" AND id_teacher="${req.data.id}"`);
      }
      if (homework.affectedRows) {
        res.status(200).json({
          success: true,
          mess: "Edit homework successful",
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

  getHomeworkStudent: async (req, res) => {
    let idHW = req.params.id;
    try {
      let result = await asyncSQL(`
            SELECT user.name,user.username,user.email,user.phone,student_homework.file,student_homework.id,student_homework.id_student,student_homework.id_homework,student_homework.time
            FROM user
            INNER JOIN student_homework ON student_homework.id_student = user.id
            WHERE id_homework = "${idHW}"
            `);
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(400);
    }
  },
};
