var router = require("express").Router();
var studentController = require("../controller/student.controller");
var multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/uploads/studentHW/");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post(
  "/homework/:idclass/:idhw",
  upload.single("homework"),
  studentController.sendHomework
);

module.exports = router;
