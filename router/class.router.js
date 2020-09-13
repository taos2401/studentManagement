const router = require("express").Router();
const classController = require("../controller/class.controller");

router.get("/:id", classController.getClass);

module.exports = router;
