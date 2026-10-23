const express = require("express");
const router = express.Router();
const pollsController = require("../controllers/pollsController.js");


router.get("/polls", pollsController.getAllPolls);
router.post("/polls", pollsController.createPoll);
router.get("/polls/:pollId", pollsController.getPollById)

module.exports = router;
