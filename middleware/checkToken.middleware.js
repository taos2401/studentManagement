var jwt = require("jsonwebtoken");
var db = require("../model/db");

module.exports = async (req, res, next) => {
  let token = req.cookies.token;
  if (!token) res.status(401).redirect("/login");
  try {
    let decodeToken = jwt.verify(token, process.env.SESSION_SECRET);
    db.query(
      `SELECT * FROM user WHERE username="${decodeToken.data.username}"`,
      (err, result) => {
        if (err) throw new Error(err);
        else {
          if (!result.length) res.status(401).send("user not found");
          else {
            req.data = decodeToken.data;
            next();
          }
        }
      }
    );
  } catch (err) {
    res.status(401).redirect("/login");
  }
};
