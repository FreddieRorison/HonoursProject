const express = require('express');
const router = express.Router();
const deviceController = require('../controller/deviceController.js');
const userController = require('../controller/userController.js');
const { login } = require("../auth/auth.js");
const { verifyUser } = require("../auth/auth.js");

router.post('/api/plantdata', deviceController.receive_data);

router.post('/login', login, userController.handle_login) // Needs Validation
router.post('/register', userController.create_account) // Needs Validation
router.post("/auth/me", verifyUser,userController.auth_me)

router.post('/createPlant', verifyUser, userController.create_plant) 
router.post('/editPlant', verifyUser, userController.edit_plant)
router.post('/removePlant', verifyUser, userController.remove_plant)
router.post('/getPlantById', verifyUser, userController.get_plant_by_id)
router.post('/getPlantInfoById', verifyUser, userController.get_plant_info_by_id)

router.post('/createDevice') // Needs Validation
router.post('/editDevice') // Needs Validation
router.post('/removeDevice') // Needs Validation
router.post('/generateNewDeviceToken') // Needs Validation
router.post('/getDeviceById') // Needs Validation

router.get('/getPlants') // Needs Validation
router.get('/getDevices') // Needs Validation
router.get('/getPlantNotifications') // Needs Validation



module.exports = router;