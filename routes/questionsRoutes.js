const express = require("express");
const router = express.Router();
const questionsController = require("../controllers/questionsController");
const {query} = require("../db/db");

router.get("/unanswered/questions/:pollId", questionsController.getUnansweredQuestions);
router.get("/answered/questions/:pollId", questionsController.getAnsweredQuestions);
router.post("/polls/:pollId/questions", questionsController.postQuestion);
router.patch("/questions/:questionId", questionsController.updateQuestion);

router.delete("/questions/:questionId", questionsController.deleteQuestion);





module.exports = router;