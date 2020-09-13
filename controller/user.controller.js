var db = require("../model/db");
var asyncSQL = require("../model/asyncQuery");
var validate = require("../middleware/validate");

module.exports = {
  getIndex: async (req, res) => {
    let username = req.data.username;
    let user = await asyncSQL(
      `SELECT id,name,email,phone,image,role FROM user WHERE username="${username}"`
    );
    if (!user) res.sendStatus(404);
    else {
      res.render("index", { userLogin: user[0] });
    }
  },

  getById: async (req, res) => {
    let idUser = req.params.id;
    let usernameLogin = req.data.username;
    let userLogin = await asyncSQL(
      `SELECT id,name,email,phone,image,role FROM user WHERE username="${usernameLogin}"`
    );
    db.query(
      `SELECT id,name,email,phone,image,role FROM user WHERE id="${idUser}"`,
      (err, result) => {
        if (err) console.log(err);
        else if (result.length) {
          db.query(
            `SELECT * FROM comment WHERE iduser="${idUser}"`,
            (err, resultCmt) => {
              if (err) throw new Error(err);
              else {
                if (req.data.role === "student")
                  res.render("showInfoUser", {
                    userLogin: userLogin[0],
                    user: result[0],
                    cmts: resultCmt,
                    role: false,
                  });
                else if (req.data.role === "teacher")
                  res.render("showInfoUser", {
                    userLogin: userLogin[0],
                    user: result[0],
                    cmts: resultCmt,
                    role: true,
                  });
              }
            }
          );
        } else {
          res.status(404).send("404 not found");
        }
      }
    );
  },

  getUpdateInfo: async (req, res) => {
    let idUser = req.params.id;
    let usernameLogin = req.data.username;
    let userLogin = await asyncSQL(
      `SELECT id,name,email,phone,image,role FROM user WHERE username="${usernameLogin}"`
    );
    if (req.data.role == "student") {
      if (req.data.id == idUser) {
        let user = await asyncSQL(
          `SELECT id,username,name,phone,email FROM user WHERE id="${idUser}"`
        );
        if (!user.length) res.sendStatus(404);
        res.render("updateInfo", {
          userLogin: userLogin[0],
          user: user[0],
          role: false,
        });
      } else res.sendStatus(404);
    } else {
      let user = await asyncSQL(
        `SELECT id,username,name,phone,email FROM user WHERE id="${idUser}"`
      );
      if (!user.length) res.sendStatus(404);
      res.render("updateInfo", {
        userLogin: userLogin[0],
        user: user[0],
        role: true,
      });
    }
  },

  postUpdateInfo: async (req, res) => {
    console.log("update ne");
    const idUser = req.params.id;
    const dataUser = req.data.username;
    const { username, name, password, email, phone } = req.body;
    try {
      let userLogin = await asyncSQL(
        `SELECT id,name,email,phone,image,role FROM user WHERE username="${dataUser}"`
      );

      if (req.data.role === "student") {
        if (req.data.idUser == idUser) {
          let user = asyncSQL(`SELECT image FROM user WHERE id="${idUser}"`);
          let image = req.file
            ? `../static/` + req.file.path.split("\\").slice(1).join("\\")
            : user[0].image;
          let sql = validate.validatePass(password)
            ? `UPDATE user SET password="${password}", email="${email}", phone ="${phone}",image="${image}" WHERE username="${dataUser}"`
            : `UPDATE user SET email="${email}", phone ="${phone}",image="${image}" WHERE username="${dataUser}"`;
          await asyncSQL(sql);
          user = await asyncSQL(
            `SELECT id,username,name,phone,email FROM user WHERE id="${idUser}"`
          );
          res.render("updateInfo", {
            userLogin: userLogin[0],
            user: user[0],
            role: true,
            error: "",
            mess: "Cập nhật thông tin thành công",
          });
        } else throw new Error("user not found");
      } else if (req.data.role == "teacher") {
        let user = await asyncSQL(
          `SELECT role,image FROM user WHERE id="${idUser}"`
        );

        let image = req.file
          ? `../static/` + req.file.path.split("\\").slice(1).join("\\")
          : user[0].image;
        if (user[0].role == "student" || idUser == req.data.id) {
          let checkUser = await asyncSQL(
            `SELECT * FROM user WHERE username="${username}"`
          );
          let user = await asyncSQL(
            `SELECT id,username,name,phone,email FROM user WHERE id="${idUser}"`
          );
          if (checkUser.length && user[0].username != username)
            res.render("updateInfo", {
              userLogin: userLogin[0],
              user: user[0],
              role: true,
              error: "Username đã được đăng kí",
            });
          else {
            let sql = validate.validatePass(password)
              ? `UPDATE user SET username="${username}",name="${name}",password="${password}", email="${email}", phone ="${phone}",image="${image}" WHERE id="${idUser}"`
              : `UPDATE user SET name="${name}",username="${username}",email="${email}", phone ="${phone}",image="${image}" WHERE id="${idUser}"`;
            await asyncSQL(sql);
            let user = await asyncSQL(
              `SELECT id,username,name,phone,email FROM user WHERE id="${idUser}"`
            );
            console.log(user);
            res.render("updateInfo", {
              userLogin: userLogin[0],
              user: user[0],
              role: true,
              mess: "Cập nhật thông tin thành công",
            });
          }
        } else throw new Error("user not found or teacher cant update teacher");
      }
    } catch (err) {
      console.log(err);
      res.sendStatus(404);
    }
  },
};
