var db = require("../../model/db");
var asyncSQL = require("../../model/asyncQuery");
const validate = require("../../middleware/validate");

module.exports = {
  getAllStudent: (req, res) => {
    db.query(
      `SELECT id,name,email,phone,image,role FROM user WHERE role="student"`,
      (err, result) => {
        if (err) console.log(err);
        else {
          if (req.data.role === "student")
            res.json({
              users: result,
              role: false,
            });
          else if (req.data.role === "teacher")
            res.status(200).json({
              users: result,
              role: true,
            });
        }
      }
    );
  },

  getAllTeacher: (req, res) => {
    db.query(
      `SELECT id,name,email,phone,image,role FROM user WHERE role="teacher"`,
      (err, result) => {
        if (err) throw new Error(err);
        else {
          res.json({
            users: result,
            role: false,
          });
        }
      }
    );
  },

  getAllClass: async (req, res) => {
    let idUser = req.params.id;
    let idUserLogin = req.data.id;
    try {
      let roleUserReq = await asyncSQL(
        `SELECT role FROM user WHERE id="${idUser}"`
      );
      if (roleUserReq[0].role == "student") {
        let classUser = await asyncSQL(
          `SELECT class.id AS id_class,class.name AS name_class,class.info AS info_class,class.number_student AS numberstudent_class, class_student.id_student AS id_student, class_student.score AS score_class,class.id_teacher AS id_teacher,user.name AS name_teacher, user.email AS email_teacher, user.phone AS phone_teacher
            FROM class 
            INNER JOIN class_student ON class_student.id_class = class.id
            INNER JOIN user ON user.id = class.id_teacher
            WHERE class_student.id_student = "${idUser}"`
        );
        res.status(200).json({ class: classUser, role: false });
      } else if (roleUserReq[0].role == "teacher") {
        let classUser = await asyncSQL(
          `SELECT * FROM class WHERE id_teacher=${idUser}`
        );
        if (idUserLogin != idUser)
          res
            .status(200)
            .json({ class: classUser, role: true, userLogin: false });
        else
          res
            .status(200)
            .json({ class: classUser, role: true, userLogin: true });
      }
    } catch (err) {
      throw new Error(err);
    }
  },

  postComment: async (req, res) => {
    let idUser = req.params.id;
    let idUserCmt = req.data.id;
    console.log(req.body);
    let cmt = req.body.cmt;
    cmt = validate.filterXSS(cmt);
    try {
      let comment = await asyncSQL(
        `INSERT INTO comment (iduser,idusercmt,usercmt,cmt) VALUES ("${idUser}","${idUserCmt}","${req.data.name}","${cmt}")`
      );
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(400).json({ success: false });
    }
  },

  getAllComment: async (req, res) => {
    let idUser = req.params.id;
    try {
      let comments = await asyncSQL(
        `SELECT * FROM comment WHERE iduser=${idUser} ORDER BY id DESC`
      );
      res.status(200).json({ comments: comments, userLogin: req.data.id });
    } catch (err) {
      res.status(400).json({ success: false });
    }
  },

  deleteComment: async (req, res) => {
    let idCmt = req.params.id;
    try {
      let result = await asyncSQL(
        `DELETE FROM comment WHERE id="${idCmt}" AND idusercmt="${req.data.id}"`
      );
      if (result.affectedRows) {
        res
          .status(200)
          .json({ success: true, mess: "Delete comment successful" });
      } else throw new Error("CMt not found or this user dont cmt this text");
    } catch (err) {
      console.log(err);
      res.status(400).json({ success: false, mess: "Something wrong !!!" });
    }
  },

  editComment: async (req, res) => {
    let idCmt = req.params.id;
    let cmt = req.body.cmt;
    cmt = validate.filterXSS(cmt);
    try {
      let result = await asyncSQL(
        `UPDATE comment SET cmt="${cmt}" WHERE id="${idCmt}" AND idusercmt="${req.data.id}"`
      );
      if (result.affectedRows) {
        res
          .status(200)
          .json({ success: true, mess: "Edit comment successful" });
      } else throw new Error("Comment not found");
    } catch (err) {
      console.log(err);
      res.status(400).json({ success: false, mess: "Something wrong !!!" });
    }
  },
};
