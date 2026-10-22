const express = require("express");
const router = express.Router();
const answerController = require("../controllers/answerController.js");

router.get("/", answerController.getVoters);
router.get("/", answerController.getMyAnswer);
router.post("/", answerController.submitAnswer);

module.exports = router;