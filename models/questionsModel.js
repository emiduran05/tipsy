const { query } = require("../db/db");

const questionsModel = {
    getUnansweredQuestions: async function (pollId, userId) {
        const res = await query("SELECT * FROM questions WHERE poll_id = $1 AND id NOT IN (SELECT question_id FROM user_answers WHERE user_id = $2)", [pollId, userId]);

        return res.rows;
    },

    getQuestionOptions: async function (questionId) {

        const result = await query("SELECT id, label FROM question_options WHERE question_id = $1", [questionId]);

        return result.rows;
    },

    getAnsweredQuestions: async function (pollId, userId) {
        const res = await query("SELECT * FROM questions WHERE poll_id = $1 AND id IN (SELECT question_id FROM user_answers WHERE user_id = $2)", [pollId, userId])

        return res.rows;
    },

    postQuestion: async function (pollId, name) {
        const res = await query("INSERT INTO questions (poll_id, name) VALUES ($1, $2) RETURNING *", [pollId, name]);

        return res.rows[0];

    },



    updateQuestion: async function (questionId, userId, name) {
        const result = await query("UPDATE questions q SET name = $1 FROM polls p WHERE q.poll_id = p.id AND q.id = $2 AND p.creator_id = $3 RETURNING q.*", [name, questionId, userId]);

        return result.rows[0];
    },

    deleteQuestion: async function (questionId, userId) {
        const result = await query("DELETE FROM questions q USING polls p WHERE q.poll_id = p.id AND q.id = $1 AND p.creator_id = $2 RETURNING q.*", [questionId, userId]);

        return result.rows[0];
    },

}

module.exports = questionsModel;