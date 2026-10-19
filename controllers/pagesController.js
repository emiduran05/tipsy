const pagesController = {
    
    showLogin: (req, res) => {
        res.sendFile("index.html", {root: "./public"}, (err) => {
            if(err){
                console.log("Error loading file: ", err)
            }
        })
    }
}

module.exports = pagesController;