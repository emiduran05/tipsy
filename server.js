require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const pagesRoutes = require("./routes/pagesRoutes.js");
const authRoutes = require("./routes/authRoutes.js");

const SECRET = process.env.SECRET;
const app = express();
const PORT = process.env.PORT;


app.use(cookieParser(SECRET));
app.use(express.json());
app.use(express.static("public"))
app.use(pagesRoutes);
app.use(authRoutes);



app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});