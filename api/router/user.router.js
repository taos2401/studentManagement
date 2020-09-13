var router = require("express").Router();
var userController = require("../controller/user.controller");

router.get("/student", userController.getAllStudent);
router.get("/teacher", userController.getAllTeacher);
router.get("/userclass/:id", userController.getAllClass);
router.get("/cmt/:id", userController.getAllComment);
router.post("/cmt/:id", userController.postComment);
router.delete("/cmt/:id", userController.deleteComment);
router.put("/cmt/:id", userController.editComment);

module.exports = router;
