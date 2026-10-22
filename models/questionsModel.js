const {query} = require("../db/db");

const questionsModel = {
    getUnansweredQuestions: async function(pollId, userId){
        const res = await query("SELECT * FROM questions WHERE poll_id = $1 AND id NOT IN (SELECT question_id FROM user_answers WHERE user_id = $2)", [pollId, userId]);

        return res.rows;
    },

    getQuestionOptions: async function(questionId){

        const result = await query("SELECT id, label FROM question_options WHERE question_id = $1", [questionId]);

        return result.rows;
    },

    getAnsweredQuestions: async function (pollId, userId){
        const res = await query("SELECT * FROM questions WHERE poll_id = $1 AND id IN (SELECT question_id FROM user_answers WHERE user_id = $2)", [pollId, userId])

        return res.rows;
    }
}

module.exports = questionsModel;