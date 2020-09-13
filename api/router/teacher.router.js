var router = require("express").Router();
var teacherController = require("../controller/teacher.controller");
var multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/uploads/hw/");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/addnewclass", teacherController.saveNewClass);
router.delete("/class/:id", teacherController.deleteClass);
router.post(
  "/addnewhw/:idclass",
  upload.single("homework"),
  teacherController.addHomeWork
);
router.get("/homework/student/:id", teacherController.getHomeworkStudent);
router.delete("/homework/:id", teacherController.deleteHomework);
router.put(
  "/homework/:id",
  upload.single("homework"),
  teacherController.editHomework
);

module.exports = router;
