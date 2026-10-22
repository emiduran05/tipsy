const { pool } = require("../db/db");
const bcrypt = require("bcrypt");


const authModel = {

    getUserData: async function (userData) {
        const { username} = userData;

         //database query
        const res = await pool.query("SELECT email, password_hash, id FROM users WHERE email = $1 ", [username]);

        return res.rows[0];

    },

    registerUser: async function(userData){
        const {name, lastname, username, email, password} = userData;

        const password_hash = await bcrypt.hash(password, 12);

        const res = await pool.query("INSERT INTO USERS (name, lastname, username, email, password_hash) VALUES ($1,$2,$3,$4,$5) RETURNING *", [name, lastname, username, email, password_hash]);

        return res.rows[0];

    }




}

module.exports = authModel;