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

exports.login = function(req, res) {
    res.status(200).send("Logged In");
}

exports.show_home = function(req, res) {
    res.status(200).send("Home lmao");
}