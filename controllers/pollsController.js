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
            const { pollId } = req.params;
            const poll = await pollsModel.getPollById(pollId);

            res.status(200).json(poll);
        } catch (error) {
            res.status(500).json("Internal server error")
            console.log(error)
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
    },


    updatePollName: async function (req, res) {
        try {
            const token = req.signedCookies.authToken;

            if (!token || !sessions[token]) {
                return res.status(401).json({
                    error: "Unauthorized"
                });
            }

            const userId = sessions[token].id;
            const { pollId } = req.params;
            const { name } = req.body;

            if (typeof name !== "string" || !name.trim() || name.trim().length > 100) {
                return res.status(400).json({
                    error: "Name must contain between 1 and 100 characters"
                });
            }

            const poll = await pollsModel.updatePollName(
                pollId,
                userId,
                name.trim()
            );

            if (!poll) {
                return res.status(404).json({
                    error: "Poll not found or you don't have permission"
                });
            }

            return res.status(200).json(poll);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                error: "Internal Server error"
            });
        }
    },

    deletePoll: async function (req, res) {
        try {
            const token = req.signedCookies.authToken;

            if (!token || !sessions[token]) {
                return res.status(401).json({
                    error: "Unauthorized"
                });
            }

            const userId = sessions[token].id;
            const { pollId } = req.params;

            const poll = await pollsModel.deletePoll(pollId, userId);

            if (!poll) {
                return res.status(404).json({
                    error: "Poll not found or you don't have permission"
                });
            }

            return res.status(200).json({
                message: "Poll deleted successfully"
            });

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                error: "Internal Server error"
            });
        }
    },

    getLeaderboard: async function (req, res) {
        try {
            const { id } = req.params;

            const leaderboard = await pollsModel.getLeaderboard(id);

            return res.status(200).json(leaderboard);

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                error: "Error fetching leaderboard"
            });
        }
    },
}

module.exports = pollsController;