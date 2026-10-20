require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const pagesRoutes = require("./routes/pagesRoutes.js");
const authRoutes = require("./routes/authRoutes.js");
const { query , connectDB } = require('./db/db');

const SECRET = process.env.SECRET;
const app = express();
const PORT = process.env.PORT;


app.use(cookieParser(SECRET));
app.use(express.json());
app.use(express.static("public"))
app.use(pagesRoutes);
app.use(authRoutes);

const startServer = async () => {
  try {
    await connectDB();            
  } catch (err) {
    console.error('Could not connect to PostgreSQL:', err.message);
    process.exit(1);             
  }
  app.listen(3000, () => {      
    console.log('Server listening on http://localhost:3000');
  });
};
startServer();