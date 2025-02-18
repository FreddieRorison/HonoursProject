const express = require('express');
const router = express.Router();
const deviceController = require('../controller/deviceController.js');
const userController = require('../controller/userController.js');
const { login } = require("../auth/auth.js");
const { verifyUser } = require("../auth/auth.js");

router.post('/api/plantdata', deviceController.receive_data);
router.post('/login', login, userController.handle_login);
router.post('/register', userController.create_account);
router.post("/auth/me", verifyUser,userController.auth_me)

router.get("/home", verifyUser, userController.show_home)


module.exports = router;