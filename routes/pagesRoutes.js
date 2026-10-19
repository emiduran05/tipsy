const express = require("express");
const router = express.Router();
const pagesController = require("../controllers/pagesController");
const requireAuth = require("../middleware/requireAuth");

router.get("/hola", requireAuth, (req, res) => {

    try {
        res.status(200).send("OK");
    } catch (error) {
        res.status(500).send("Internal server error");
    }

})


router.get("/login", pagesController.showLogin);


module.exports = router;