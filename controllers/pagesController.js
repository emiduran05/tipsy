const pagesController = {
    
    showLogin: (req, res) => {
        res.sendFile("index.html", {root: "./views/public"}, (err) => {
            if(err){
                console.log("Error loading file: ", err)
            }
        })
    },

    showRegister: (req, res) => {
        res.sendFile("register.html", {root: "./views/public"}, (err) => {
            if(err){
                console.log("Error loading file")
            }
        })
    },

    showQuestions: (req, res) => {
        res.sendFile("questions.html", {root: "./views/private"}, (err) => {
            if(err){
                console.log("Error loading file")
            }
        })
    },

    showUser: (req,res) => {
        res.sendFile("user-page.html",{root: "./views/private"}, (err) => {
            if(err){
                console.log("Error loading file: ", err)
            }
        })
    }
}

module.exports = pagesController;