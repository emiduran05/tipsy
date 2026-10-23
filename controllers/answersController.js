const answersModel = require("../models/answersModel");
const sessions = require("../config/sessions");

const answersController = {
    postAnswer: async function (req, res) {
        try {
            const token = req.signedCookies.authToken;

            if (!token || !sessions[token]) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            const userId = sessions[token].id;
            const questionId = Number(req.params.questionId);
            const optionId = Number(req.body.option_id);


            const question = await answersModel.getQuestionWithPoll(questionId);
            const deadlinePassed = question && question.deadline && new Date(question.deadline) < new Date();

            if (!question || question.status !== "open" || deadlinePassed) {
                return res.status(403).json({ error: "You can't answer this question" });
            }

            const option = await answersModel.getOptionById(optionId);

            if (!option || option.question_id !== questionId) {
                return res.status(400).json({ error: "Invalid option" });
            }

            const answer = await answersModel.createAnswer(questionId, userId, optionId);
            res.status(201).json(answer);

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server error" });
        }
    }
}

module.exports = answersController;