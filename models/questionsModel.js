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

    getQuestionById: async function (questionId) {
        const result = await query(
            `SELECT questions.id, questions.poll_id, questions.name, polls.creator_id
         FROM questions
         JOIN polls ON polls.id = questions.poll_id
         WHERE questions.id = $1`,
            [questionId]
        );
        return result.rows[0];
    },

    deleteQuestion: async function (questionId) {
        const result = await query(
            `WITH deleted_answers AS (
             DELETE FROM user_answers WHERE question_id = $1
         ),
         deleted_options AS (
             DELETE FROM question_options WHERE question_id = $1
         )
         DELETE FROM questions WHERE id = $1
         RETURNING *`,
            [questionId]
        );
        return result.rows[0];
    }
}

module.exports = questionsModel;