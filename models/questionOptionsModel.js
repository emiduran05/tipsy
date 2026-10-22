const {query} = require("../db/db");


const questionOptionsModel = {
    postOptions: async function(question_id, label, correct_option, points){
        const res = await query("INSERT INTO question_options (question_id, label, correct_option, points) VALUES ($1, $2, $3, $4) RETURNING *", [question_id, label,correct_option, points]);
        return res.rows;
    }
}

module.exports = questionOptionsModel;