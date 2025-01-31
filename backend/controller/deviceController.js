exports.receive_data = function(req, res) {
    deviceId = req.body.deviceId;
    moisture = req.body.moisture;
    temperature = req.body.temperature;
    console.log(deviceId + " " + moisture + " " + temperature)
    
    res.status(200).send("Received");
}