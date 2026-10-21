require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const pagesRoutes = require("./routes/pagesRoutes.js");
const userRoutes = require("./routes/userRoutes.js");

const SECRET = process.env.SECRET;
const app = express();
const PORT = process.env.PORT;


app.use(cookieParser(SECRET));
app.use(express.json());
app.use(express.static("views/public/resources"))
app.use(pagesRoutes);
app.use(userRoutes);


app.listen(PORT, () =>{
  console.log(`Port listening ${PORT}`)
})

