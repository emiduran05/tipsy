const sessions = require("../config/sessions.js");


const pagesController = {

    showLogin: (req, res) => {
        res.sendFile("index.html", { root: "./views/public" }, (err) => {
            if (err) {
                console.log("Error loading file: ", err)
            }
        })
    },

    showRegister: (req, res) => {
        res.sendFile("register.html", { root: "./views/public" }, (err) => {
            if (err) {
                console.log("Error loading file")
            }
        })
    },

    showQuestions: (req, res) => {
        const token = req.signedCookies.authToken;
        const user = sessions[token];

        if (user.user === "emiduranf05@gmail.com") {
            res.sendFile("questions2.html", { root: "./views/private" }, (err) => {
                if (err) {
                    console.log("Error loading file")
                }
            })
        } else {
            res.sendFile("questions.html", { root: "./views/private" }, (err) => {
                if (err) {
                    console.log("Error loading file")
                }
            })
        }


    },

    showUser: (req, res) => {

        const token = req.signedCookies.authToken;
        const user = sessions[token];

        if (user.user === "emiduranf05@gmail.com") {
            res.sendFile("user-page.html", { root: "./views/private" }, (err) => {
                if (err) {
                    console.log("Error loading file: ", err)
                }
            })
        } else {
            res.sendFile("user-page2.html", { root: "./views/private" }, (err) => {
                if (err) {
                    console.log("Error loading file: ", err)
                }
            })
        }



    }
}

module.exports = pagesController;