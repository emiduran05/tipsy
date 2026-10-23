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

    },

    updatePollName: async function(pollId, userId, name) {
    const result = await query(`
        UPDATE polls
        SET name = $1
        WHERE id = $2 AND creator_id = $3
        RETURNING *
    `, [name, pollId, userId]);

    return result.rows[0];
},

deletePoll: async function(pollId, userId) {
    const result = await query(`
        DELETE FROM polls
        WHERE id = $1 AND creator_id = $2
        RETURNING *
    `, [pollId, userId]);

    return result.rows[0];
},

getLeaderboard: async function(pollId) {
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
    `, [pollId]);

    return result.rows;
},
}

module.exports = pollsModel;
