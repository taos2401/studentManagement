var db = require("../model/db");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");

function validPassword(password, hash, salt) {
  password = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  console.log(password == hash);
  return password == hash;
}

function setPassword(password) {
  let salt = crypto.randomBytes(16).toString("hex");
  let hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return [hash, salt];
}

module.exports = {
  getLogin: (req, res) => {
    res.render("auth/login");
  },

  postLogin: async (req, res) => {
    var { username, password } = req.body;
    if (!username || !password)
      res.render("auth/login", { error: "All fields are required" });
    let data = await db.query(
      `SELECT * FROM user WHERE username="${username}"`,
      async (err, data) => {
        if (!data.length)
          res.render("auth/login", { error: "invalid username or password" });
        else {
          if (!validPassword(password, data[0].password, data[0].salt))
            res.render("auth/login", { error: "invalid username or password" });
          else {
            const token = await jwt.sign(
              {
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
                data: {
                  id: data[0].id,
                  username: data[0].username,
                  email: data[0].email,
                  name: data[0].name,
                  role: data[0].role,
                },
              },
              process.env.SESSION_SECRET
            );
            res.cookie("token", token);
            res.status(200).redirect("/");
          }
        }
      }
    );
  },

  getRegister: (req, res) => {
    res.render("auth/register");
  },

  postRegister: (req, res) => {
    let { name, username, password, email, phone, role } = req.body;
    let avatar = req.file
      ? `/static/` + req.file.path.split("\\").slice(1).join("/")
      : "https://st.quantrimang.com/photos/image/072015/22/avatar.jpg";
    let hash = setPassword(password);

    db.query(
      `SELECT * FROM user WHERE username="${username}"`,
      (err, resultByUsername) => {
        var error = {};
        if (resultByUsername[0]) error.username = "exist username";
        db.query(
          `SELECT * FROM user WHERE email="${email}"`,
          (err, resultByEmail) => {
            if (resultByEmail[0]) error.email = "exist email";
            if (error.mail || error.username) {
              error.values = req.body;
              error.file = req.file;
              res.render("auth/register", error);
            } else {
              let sql = `INSERT INTO user (username,password,salt,name,email,phone,image,role) VALUES ("${username}","${hash[0]}","${hash[1]}","${name}","${email}","${phone}","${avatar}","${role}")`;
              db.query(sql, (err, result) => {
                if (err) console.log(err);
                else {
                  res.redirect("/login");
                }
              });
            }
          }
        );
      }
    );
  },

  logout: (req, res) => {
    res.clearCookie("token").redirect("/login");
  },
};
