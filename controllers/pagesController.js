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

    showEvent: (req,res) => {
        res.sendFile("event.html",{root: "./views/private"}, (err) => {
            if(err){
                console.log(error)
            }
        })
    }
}

module.exports = pagesController;