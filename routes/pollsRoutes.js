const express = require("express");
const router = express.Router();
const pollsController = require("../controllers/pollsController.js");


router.get("/user-page", pollsController.getAllPolls);
router.post("/user-page", pollsController.createPoll);

module.exports = router;
