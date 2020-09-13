var router = require("express").Router();
var classController = require("../controller/class.controller");

router.get("/all", classController.getAllClass);
router.get("/:id/homework", classController.getAllHomework);

module.exports = router;
