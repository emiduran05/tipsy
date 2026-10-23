const express = require("express");
const router = express.Router();
const pollsController = require("../controllers/pollsController.js");


router.get("/polls", pollsController.getAllPolls);
router.get("/polls/:pollId", pollsController.getPollById);
router.post("/polls", pollsController.createPoll);

router.patch("/polls/:pollId", pollsController.updatePollName);
router.delete("/polls/:pollId", pollsController.deletePoll);
router.get("/polls/:id/leaderboard", pollsController.getLeaderboard);

module.exports = router;
