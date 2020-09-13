var validate = require("./validate");

module.exports = function (req, res, next) {
  let { name, username, password, repassword, email, phone, role } = req.body;
  let error = {};
  let err = 0;
  if (!validate.validateEmail(email)) {
    error.email = "invalid email";
    err = 1;
  }
  if (!validate.validatePass(password)) {
    error.password = "invalid password";
    err = 1;
  }
  if (password !== repassword) {
    error.repassword = "invalid confirmed password";
    err = 1;
  }
  if (!validate.validateString(name)) {
    error.name = "invalid name";
    err = 1;
  }
  if (!validate.validateString(username)) {
    error.username = "invalid username";
    err = 1;
  }
  if (!validate.validateString(phone)) {
    error.phone = "invalid phone";
    err = 1;
  }

  if (err === 1) {
    error.values = req.body;
    error.file = req.file;
    res.render("auth/register", error);
    return;
  }
  next();
};
