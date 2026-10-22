const pollModel = require("../models/pollModel.js");

const pollController = {
    
    getAllPolls: async function (req, res) {
        const polls = await pollModel.getPollData({});
    },

    createPoll: async function (req, res) {
        try {

        } catch (error) {

        }
    }
}