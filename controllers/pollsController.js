const pollsModel = require("../models/pollsModel.js");
const sessions = require("../config/sessions.js");

const pollsController = {

    getAllPolls: async function (req, res) {
        try {
            const polls = await pollsModel.getPollsData();
            res.status(200).json(polls);

        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Internal Server error"
            })
        }


    },

    getPollById: async function (req, res) {
        try {
            const pollId = Number(req.params.pollId);

            if (!Number.isInteger(pollId)) {
                return res.status(400).json({
                    error: "pollId must be a number"
                });
            }

            const poll = await pollsModel.getPollById(pollId);

            if (!poll) {
                return res.status(404).json({
                    error: "Poll not found"
                });
            }

            res.status(200).json(poll);

        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Internal Server error"
            });
        }
    },

    createPoll: async function (req, res) {
        try {

            const token = req.signedCookies.authToken;

            if (!token || !sessions[token]) {
                return res.status(401).json({
                    error: "Unauthorized"
                });
            }

            const userId = sessions[token].id;
            const { name, deadline, description } = req.body;

            if (!name) {
                return res.status(400).json({
                    error: "Name is required"
                });
            }

            const poll = await pollsModel.createPoll(userId, name, deadline, description);
            res.status(201).json(poll);


        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: "Internal Server error"
            })
        }
    }
}

module.exports = pollsController;