const questionsModel = require("../models/questionsModel");
const sessions = require("../config/sessions")
const questionOptionsModel = require("../models/questionOptionsModel");

const questionsController = {

    getUnansweredQuestions: async function (req, res) {

        try {
            const { pollId } = req.params;

            const token = req.signedCookies.authToken;

            if (!token || !sessions[token]) {
                return res.status(401).json({
                    error: "Unauthorized"
                });
            }

            const userId = sessions[token].id;

            const questions = await questionsModel.getUnansweredQuestions(
                pollId,
                userId
            );

            for (const question of questions) {
                const options = await questionsModel.getQuestionOptions(
                    question.id
                );

                question.options = options;
            }

            res.status(200).json(questions);

        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Internal Server error"
            });
        }

    },

    getAnsweredQuestions: async function (req, res) {
        try {
            const { pollId } = req.params;

            const token = req.signedCookies.authToken;

            if (!token || !sessions[token]) {
                return res.status(401).json({
                    error: "Unauthorized"
                });
            }

            const userId = sessions[token].id;

            const questions = await questionsModel.getAnsweredQuestions(
                pollId,
                userId
            );

            for (const question of questions) {
                const options = await questionsModel.getQuestionOptions(
                    question.id
                );

                question.options = options;
            }

            res.status(200).json(questions);

        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Internal Server error"
            });
        }
    },


    postQuestion: async function (req, res) {
        try {
            const { pollId } = req.params;
            const { name, options } = req.body;

            if (!name || !Array.isArray(options) || options.length < 2) {
                return res.status(400).json({ error: "Invalid question" });
            }

            const question = await questionsModel.postQuestion(pollId, name);

            for (const option of options) {
                await questionOptionsModel.postOptions(
                    question.id,
                    option.label,
                    option.correct_option,
                    option.points
                );
            }

            res.status(201).json({
                message: "Question created successfully"
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Internal server error"
            });
        }
    },

    deleteQuestion: async function (req, res) {
    try {
        const token = req.signedCookies.authToken;

        if (!token || !sessions[token]) {
            return res.status(401).json({
                error: "Unauthorized"
            });
        }

        const userId = sessions[token].id;
        const questionId = Number(req.params.questionId);

        if (!Number.isInteger(questionId)) {
            return res.status(400).json({
                error: "questionId must be a number"
            });
        }

        const question = await questionsModel.getQuestionById(questionId);

        if (!question) {
            return res.status(404).json({
                error: "Question not found"
            });
        }

        if (question.creator_id !== userId) {
            return res.status(403).json({
                error: "Only the creator can delete this question"
            });
        }

        await questionsModel.deleteQuestion(questionId);

        res.status(200).json({
            message: "Question deleted"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal Server error"
        });
    }
}
}

module.exports = questionsController;