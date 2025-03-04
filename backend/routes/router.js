const express = require('express');
const router = express.Router();
const deviceController = require('../controller/deviceController.js');
const userController = require('../controller/userController.js');
const { login } = require("../auth/auth.js");
const { verifyUser } = require("../auth/auth.js");

// Device Routes

router.post('/api/SubmitData', deviceController.receive_data); // Somewhat Tested

// User Routes

router.post('/login', login, userController.handle_login)
router.post('/register', userController.create_account) // Needs Validation
router.post("/auth/me", verifyUser,userController.auth_me)

router.post('/createPlant', verifyUser, userController.create_plant) 
router.post('/editPlantName', verifyUser, userController.edit_plant_name)
router.post('/editPlantInfoId', verifyUser, userController.edit_plant_infoId)
router.post('/editPlantMoisture', verifyUser, userController.edit_plant_moisture)
router.post('/editPlantTemperature', verifyUser, userController.edit_plant_temperature)
router.post('/editPlantPh', verifyUser, userController.edit_plant_ph)
router.post('/removePlant', verifyUser, userController.remove_plant) // Needs Tested
router.post('/getPlantById', verifyUser, userController.get_plant_by_id)
router.post('/getPlantInfoById', verifyUser, userController.get_plant_info_by_id)
router.post('/getPlantTypes', verifyUser, userController.get_plant_types)
router.post('/getUserPlants', verifyUser, userController.get_plants)
router.post('/getPlantNotifications', verifyUser, userController.get_notifications) // Needs Tested
router.post('/getPlantMoistureData', verifyUser, userController.get_plant_moisture_data)
router.post('/getPlantTemperatureData', verifyUser, userController.get_plant_temp_data)
router.post('/getPlantPhData', verifyUser, userController.get_plant_ph_data)
router.post('/getPlantStatus', verifyUser, userController.get_plant_status) // Needs Developed

router.post('/createDevice', verifyUser, userController.create_device)
router.post('/editDeviceName', verifyUser, userController.edit_device_name)
router.post('/editDeviceDescription', verifyUser, userController.edit_device_description)
router.post('/generateNewDeviceToken', verifyUser, userController.generate_new_device_token)
router.post('/removeDevice', verifyUser, userController.remove_device)
router.post('/getDeviceById', verifyUser, userController.get_device_by_id)
router.post('/getDeviceAccessKey',verifyUser, userController.get_device_access_key)
router.post('/getUserDevices', verifyUser, userController.get_devices)
router.post('/changeDevicePlant', verifyUser, userController.edit_assigned_plant)

module.exports = router;