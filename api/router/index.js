var router = require("express").Router();
var userRouter = require("./user.router");
var teacherRouter = require("./teacher.router");
var classRouter = require("./class.router");
var studentRouter = require("./student.router");

var checkTeacher = require("../../middleware/checkTeacher.middleware");
var checkStudent = require("../../middleware/checkStudent.middleware");

router.use("/", userRouter);
router.use("/teacher", checkTeacher, teacherRouter);
router.use("/class", classRouter);
router.use("/student", checkStudent, studentRouter);

module.exports = router;
