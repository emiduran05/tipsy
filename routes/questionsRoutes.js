const express = require("express");
const router = express.Router();
const questionsController = require("../controllers/questionsController");
const {query} = require("../db/db");

router.get("/unanswered/questions/:pollId", questionsController.getUnansweredQuestions);
router.get("/answered/questions/:pollId", questionsController.getAnsweredQuestions);
router.post("/polls/:pollId/questions", questionsController.postQuestion);
router.patch("/questions/:questionId", questionsController.updateQuestion);

router.delete("/questions/:questionId", questionsController.deleteQuestion);



router.get("/polls/:id/leaderboard", async (req, res) => { 
    try {
        const { id } = req.params;

        const result = await query(`
            SELECT
                u.id,
                u.username,
                SUM(qo.points) AS total_points
            FROM users u
            JOIN user_answers ua
                ON u.id = ua.user_id
            JOIN questions q
                ON ua.question_id = q.id
            JOIN question_options qo
                ON ua.option_id = qo.id
            WHERE q.poll_id = $1
            GROUP BY u.id, u.username
            ORDER BY total_points DESC
        `, [id]);

        res.status(200).json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Error fetching leaderboard"
        });
    }
});

module.exports = router;