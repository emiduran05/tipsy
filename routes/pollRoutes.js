const express = require("express");
const router = express.Router();
const pollController = require("../controllers/pollController.js");

router.get("/", pollController.getAllPolls);
router.post("/", pollController.createPoll);
router.patch("/", pollController.updateStatus);
router.delete("/", pollController.delete);

module.exports = router;