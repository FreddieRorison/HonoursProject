const express = require('express');
const router = express.Router();
const deviceController = require('../controller/deviceController.js');
const userController = require('../controller/userController.js');
const { login } = require("../auth/auth.js");
const { verifyUser } = require("../auth/auth.js");

router.post('/api/plantdata', deviceController.receive_data);

const MaxNameLength = 28; 
const MinNameLength = 4; 
const MaxDescriptionLength = 48; 

router.post('/login', login, userController.handle_login)
router.post('/register', userController.create_account) // Needs Validation
router.post("/auth/me", verifyUser,userController.auth_me)

router.post('/createPlant', verifyUser, userController.create_plant) 
router.post('/editPlant', verifyUser, userController.edit_plant)
router.post('/editPlantName') // Needs Validation
router.post('/editPlantInfoId') // Needs Validation
router.post('/editPlantMoisture') // Needs Validation
router.post('/editPlantTemperature') // Needs Validation
router.post('/editPlantPh') // Needs Validation
router.post('/removePlant', verifyUser, userController.remove_plant)
router.post('/getPlantById', verifyUser, userController.get_plant_by_id)
router.post('/getPlantInfoById', verifyUser, userController.get_plant_info_by_id)
router.post('/getUserPlants') // Needs Validation
router.post('/getPlantNotifications') // Needs Validation
router.post('/getPlantMoistureData') // Needs Validation
router.post('/getPlantTemperatureData') // Needs Validation
router.post('/getPlantPhData') // Needs Validation

router.post('/createDevice', verifyUser, userController.create_device)
router.post('/editDeviceName', verifyUser, userController.edit_device_name)
router.post('/editDeviceDescription', verifyUser, userController.edit_device_description) // Needs tested
router.post('/generateNewDeviceToken', verifyUser, userController.generate_new_device_token) // Needs tested
router.post('/removeDevice', verifyUser, userController.remove_device) // Needs tested
router.post('/getDeviceById') // Needs Validation
router.post('/getUserDevices') // Needs Validation

module.exports = router;