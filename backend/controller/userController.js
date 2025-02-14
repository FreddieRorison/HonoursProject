const jwt = require("jsonwebtoken")
const validator = require('email-validator');
const userModel = require("../models/userModel.js");

exports.create_account = function(req, res) {
    var firstname = req.body.firstname;
    var email = req.body.email;
    var password = req.body.password;
    if (!firstname || !email || !password) { res.status(401).send("Form Incomplete"); return;}
    if(!validator.validate(email)) {res.status(401).send("Email invalid"); return;}

    // Test Password

    userModel.getfromEmail(email, function (err, user) {
        if (err) {res.status(401).send("Error");return;}
        if(user) {res.status(401).send("User already exists!");return;}
        userModel.create(firstname, email, password);
        res.status(200).send("User Created!");
        return;
    })
}

exports.show_home = function(req, res) {
    res.status(200).send("Home lmao");
}

exports.auth_me = function(req, res) {
    getUser(req.cookies?.jwt, function(err, result) {
        if (err) { console.log(err)}
        if (result) {
            res.status(200).send({
                "userId":result.Id,
                "firstname":result.Firstname,
                "email":result.Email
            });
        } else {
            res.status(403).send();
        }
    })
    
}

function getUser(token, cb) {
    try {
        let payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        userModel.getfromId(payload.userId, function(err, user) {
            if (err) {console.warn(err); return cb(null, null);}
            return cb(null, user);
        }) 
    } catch (e) {
        return cb(null, null);
    }
}