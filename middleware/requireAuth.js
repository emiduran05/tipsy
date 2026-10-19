const sessions = require("../config/sessions.js");

function requireAuth(req, res, next){
    const token = req.signedCookies.authToken;

    if(token && sessions[token]){
        next();
    }else{
        res.redirect("/login");
    }
};

module.exports = requireAuth;