const express = require('express');
const router = express.Router();
const deviceController = require('../controller/deviceController.js');

router.post('/api/plantdata', deviceController.receive_data);

module.exports = router;