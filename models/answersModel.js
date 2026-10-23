const { query } = require("../db/db");

const answersModel = {

    getQuestionWithPoll: async function (questionId) {
        const result = await query(`
        SELECT
            q.id,
            q.poll_id,
            p.status AS poll_status,
            p.deadline
        FROM questions q
        JOIN polls p ON q.poll_id = p.id
        WHERE q.id = $1
    `, [questionId]);

        return result.rows[0];
    },

    getOptionById: async function (optionId) {
        const result = await query(
            "SELECT * FROM question_options WHERE id = $1",
            [optionId]
        );
        return result.rows[0];
    },

    createAnswer: async function (questionId, userId, optionId) {
        const result = await query(
            `INSERT INTO user_answers (question_id, user_id, option_id)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [questionId, userId, optionId]
        );
        return result.rows[0];
    }
};

module.exports = answersModel;