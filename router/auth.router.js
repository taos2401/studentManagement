var router = require("express").Router();
var authController = require("../controller/auth.controller");
var registerValidate = require("../middleware/register.validate");
var multer = require("multer");

var upload = multer({ dest: "public/uploads/" });

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.get("/register", authController.getRegister);

router.post(
  "/register",
  upload.single("avatar"),
  registerValidate,
  authController.postRegister
);

router.get("/logout", authController.logout);
module.exports = router;
