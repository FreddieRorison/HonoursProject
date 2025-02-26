const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const userModel = require('../models/userModel');

exports.login = function(req, res, next) {
    let email = req.body.email;
    let pass = req.body.password;

    userModel.getfromEmail(email, function (err, user) {
        if (err) {return res.status(500).send()}
        if (!user) {
            return res.status(401).send("User not found...");
        }
        bcrypt.compare(pass, user.Password, function (err, result) {
            if (result) {
                let payload = { userId: user.Id};
                let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600})
                res.cookie("jwt", accessToken);
                next();
            } else {
                return res.status(403).send();
            }
        })
    })
}

exports.verifyUser = function(req, res, next) {
    if (!req.body.jwt) {
        return res.status(403).send();
    }

    var token = req.body.jwt.split(";")[0];
    if (!token) {
        return res.status(403).send("Forbidden.");
    }
    let payload;
    try {
        payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        next();
    } catch (e) {
        console.warn(e);
        res.status(401).send();
    }
}

exports.verifyDevice = function(req, res, next) {

}