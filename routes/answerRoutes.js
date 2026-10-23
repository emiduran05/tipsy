const express = require("express");
const router = express.Router();
const answersController = require("../controllers/answersController");

router.post("/questions/:questionId/answers", answersController.postAnswer);

module.exports = router;