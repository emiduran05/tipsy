const questionsModel = require("../models/questionsModel");
const sessions = require("../config/sessions")

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

    getAnsweredQuestions: async function(req,res){
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
    }
}

module.exports = questionsController;