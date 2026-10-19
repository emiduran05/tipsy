const crypto = require("crypto");
const sessions = require("../config/sessions.js");
const authModel = require("../models/authModel.js");

const authController = {
    login: async function (req, res) {
        try {
            const { username, password } = req.body;
            const user = await authModel.login({ username });

            if (!user) {
                res.status(401).json({ status: "Not found" });
            } else {

                if (password === user.password) {
                    const token = crypto.randomBytes(64).toString("hex");

                    sessions[token] = { username };

                    res.cookie("authToken", token, { signed: true, httOnly: true });
                    res.status(200).json({ status: "OK" });
                }else{
                    res.status(401).json({status: "Invalid credetnials"})
                }

            }





        } catch (error) {
            res.status(500).json("Internal server error: ");
            console.log(error);
        }
    },
}

module.exports = authController;