const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");

router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/users/me", userController.getCurrentUser);

module.exports = router;