
const answersModel = require("../models/answersModel");
const sessions = require("../config/sessions");

const answersController = {

    postAnswer: async function (req, res) {
        try {
            const token = req.signedCookies.authToken;

            if (!token || !sessions[token]) {
                return res.status(401).json({
                    error: "Unauthorized"
                });
            }

            const userId = sessions[token].id;
            const questionId = Number(req.params.questionId);
            const optionId = Number(req.body.option_id);

            if (!Number.isInteger(questionId) ||
                !Number.isInteger(optionId) ||
                questionId <= 0 ||
                optionId <= 0) {
                return res.status(400).json({
                    error: "Invalid question or option ID"
                });
            }

            const question = await answersModel.getQuestionWithPoll(questionId);

            if (!question) {
                return res.status(404).json({
                    error: "Question not found"
                });
            }
            
            if (question.creator_id === userId) {
                return res.status(403).json({
                    error: "You can't vote on your own question"
                });
            }

            // Validate poll status
            if (question.poll_status !== "open") {
                return res.status(403).json({
                    error: "This poll is closed"
                });
            }

            // Validate deadline
            const deadlinePassed =
                question.deadline &&
                new Date(question.deadline) < new Date();

            if (deadlinePassed) {
                return res.status(403).json({
                    error: "The deadline has passed"
                });
            }

            // Validate selected option
            const option = await answersModel.getOptionById(optionId);

            if (!option || option.question_id !== questionId) {
                return res.status(400).json({
                    error: "Invalid option"
                });
            }

            // Save answer
            const answer = await answersModel.createAnswer(
                questionId,
                userId,
                optionId
            );

            return res.status(201).json(answer);

        } catch (error) {
            console.error(error);

            if (error.code === "23505") {
                return res.status(409).json({
                    error: "You already answered this question"
                });
            }

            return res.status(500).json({
                error: "Internal Server error"
            });
        }
    }
};

module.exports = answersController;
