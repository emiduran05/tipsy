const crypto = require("crypto");
const sessions = require("../config/sessions.js");
const userModel = require("../models/userModel.js");
const bcrypt = require("bcrypt");


const userController = {
    login: async function (req, res) {
        try {
            const { username, password } = req.body;
            const user = await userModel.getUserData({ username });
            const isValid = await bcrypt.compare(password, user.password_hash )

            if (!user) {
                res.status(401).json({ status: "Not found" });
            } else {

                if (isValid) {
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


    register: async function (req, res){
        try {
            const {name, lastname, username, email, password} = req.body;

            if(!name || !lastname || !username || !email || !password){
                res.status(400).json({status: "Missing values"})
            }else{

                const newUser = await userModel.registerUser({name, lastname, username, email, password});
                res.status(200).json(newUser);

            }            
            
        } catch (error) {
            res.status(500).json({status: "Internal Server error"});
            console.log(error);
        }
    }
}

module.exports = userController;