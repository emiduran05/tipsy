const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const query = (text, params) => pool.query(text, params);

async function connectDB() {
  await pool.query(`
    
CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(50) NOT NULL,
    lastname      VARCHAR(50) NOT NULL,
    username      VARCHAR(50) NOT NULL UNIQUE,
    email         VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(10) NOT NULL DEFAULT 'user'
                  CHECK (role IN ('user', 'admin'))
);

CREATE TABLE IF NOT EXISTS polls (
    id         SERIAL PRIMARY KEY,
    creator_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name       VARCHAR(100) NOT NULL,
    status     VARCHAR(10) NOT NULL DEFAULT 'open'
               CHECK (status IN ('open', 'closed', 'resolved')),
    deadline   TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
    id      SERIAL PRIMARY KEY,
    poll_id INT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    name    VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS question_options (
    id             SERIAL PRIMARY KEY,
    question_id    INT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    label          VARCHAR(255) NOT NULL,
    correct_option BOOLEAN,
    points         INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_answers (
    id          SERIAL PRIMARY KEY,
    question_id INT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    option_id   INT NOT NULL REFERENCES question_options(id) ON DELETE CASCADE,
    UNIQUE (question_id, user_id)
);

    `);

  await pool.query("ALTER TABLE polls ADD COLUMN IF NOT EXISTS description VARCHAR(255)");
  console.log('Tables ready');
}

module.exports = { query, connectDB, pool };