var router = require("express").Router();
var userController = require("../controller/user.controller");
var multer = require("multer");
var upload = multer({ dest: "public/uploads/" });

router.get("/", userController.getIndex);

router.get("/users/:id", userController.getById);

router.get("/users/updateprofile/:id", userController.getUpdateInfo);
router.post(
  "/users/updateprofile/:id",
  upload.single("avatar"),
  userController.postUpdateInfo
);

module.exports = router;
