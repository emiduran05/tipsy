const { query } = require("../db/db");

const pollsModel = {

    getPollsData: async function () {
        const result = await query(`
        SELECT polls.id, polls.name, polls.status, polls.deadline, polls.description,
               COUNT(DISTINCT questions.id)         AS question_count,
               COUNT(DISTINCT user_answers.user_id) AS user_count
        FROM polls
        LEFT JOIN questions    ON questions.poll_id = polls.id
        LEFT JOIN user_answers ON user_answers.question_id = questions.id
        GROUP BY polls.id
        ORDER BY polls.deadline
    `);
        return result.rows;
    },

    getPollById: async function (pollId) {
        const result = await query(
            "SELECT id, name, status, deadline, creator_id FROM polls WHERE id = $1",
            [pollId]
        );
        return result.rows[0];
    },

    createPoll: async function (creatorId, name, deadline, description) {
        const result = await query(
            "INSERT INTO polls (creator_id, name, deadline, description) VALUES ($1, $2, $3, $4) RETURNING *",
            [creatorId, name, deadline || null, description || null]
        );
        return result.rows[0];

    }
}

module.exports = pollsModel;
