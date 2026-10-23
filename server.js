require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const pagesRoutes = require("./routes/pagesRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const pollsRoutes = require("./routes/pollsRoutes.js");
const questionsRoutes = require("./routes/questionsRoutes.js");
const answersRoutes = require("./routes/answersRoutes.js");
const { connectDB } = require("./db/db.js");

const SECRET = process.env.SECRET;
const app = express();
const PORT = process.env.PORT;

app.use(cookieParser(SECRET));
app.use(express.json());
app.use(express.static("views/public/resources"))
app.use(pagesRoutes);
app.use(userRoutes);
app.use(questionsRoutes);
app.use(pollsRoutes);
app.use(answersRoutes);


connectDB()
  .then(() => {
    app.listen(PORT, () =>{
      console.log(`Port listening ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("Database setup failed: ", error);
    process.exit(1);
  });

