const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '12345',
  database: 'projectdb',
});

const query = (text, params) => pool.query(text, params);

async function connectDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      name          VARCHAR(50)  NOT NULL,
      lastname      VARCHAR(50)  NOT NULL,
      username      VARCHAR(50)  NOT NULL UNIQUE,
      email         VARCHAR(50)  NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role          VARCHAR(10)  NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'))
    );

    CREATE TABLE IF NOT EXISTS polls (
      id         SERIAL PRIMARY KEY,
      creator_id INT NOT NULL REFERENCES users(id),
      name       VARCHAR(100) NOT NULL,
      status     VARCHAR(10)  NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'resolved')),
      deadline   TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS questions (
      id      SERIAL PRIMARY KEY,
      poll_id INT NOT NULL REFERENCES polls(id),
      name    VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS question_options (
      id             SERIAL PRIMARY KEY,
      question_id    INT NOT NULL REFERENCES questions(id),
      label          VARCHAR(255) NOT NULL,
      correct_option BOOLEAN,
      points         INT NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS user_answers (
      id          SERIAL PRIMARY KEY,
      question_id INT NOT NULL REFERENCES questions(id),
      user_id     INT NOT NULL REFERENCES users(id),
      option_id   INT NOT NULL REFERENCES question_options(id),
      UNIQUE (question_id, user_id)
    );
  `);
  console.log('Tables ready');
}

module.exports = { query, connectDB };