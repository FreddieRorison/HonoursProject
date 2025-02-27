const uuid = require('uuid');

const plantModel = require("../models/plantModel.js");
const deviceModel = require("../models/deviceModel.js");

// Upper Limit of Temperature is 100; Lower Bound is -30
// Upper Limit of Ph is 14; Lower Bound is 0
// Upper Limit of Moisture is 100; Lower Bound is 0

const MaximumTemp = 100;
const MinimumTemp = -30;
const MaximumPh = 14;
const MinimumPh = 0;
const MaximumMoisture = 100;
const MinimumMoisture = 0;

exports.receive_data = function(req, res) {
    const deviceKey = req.body?.deviceId;
    const entries = req.body?.data;

    if (!deviceKey) {
        res.status(400).send("Missing Device Key;");
        return;
    }

    if (entries.size < 1) {
        res.status(400).send("Missing Data;");
        return;
    }

    let device = {};

    getDevice(deviceKey, function(err, result) {
        device = result;
    })

    if (!device) {
        res.status(400).send("Device Not Found;");
        return;
    }

    let conforms = false;

    checkEntriesConform(entries, function(err, result) {
        conforms = result;
    })

    if (!conforms) {
        res.status(400).send("Data Missing or outwith Limits;");
        return;
    }

    insertData(UserPlantId, entries)
}

function insertData(UserPlantId, entries) {
    let previousTime = new Date();

    plantModel.getLastDataRow(UserPlantId, function(err, result) {
        if (err) {console.error(err);}
        if (result) {
            previousTime = new Date(result.Date.replace(" ", "T"));
        } else {
            previousTime = new Date()
            previousTime.setFullYear(previousTime.getFullYear() - 1)
        }
    })

    entries.forEach(entry => {
        let entryDate = new Date(entry.Date.replace(" ", "T"));
        if (entryDate > previousTime.setMinutes(previousTime.getMinutes()+5)) {
            plantModel.insertDataRow(UserPlantId,entry);
        }
    });
}

function checkEntriesConform(UserPlantId, entries, cb) {
    let valid = true;
    let UserPlant = {};
    plantModel.getPlantFromId(UserPlantId, function(err, res) {
        UserPlant = res;
    })

    if (UserPlant.Moisture == 1) {
        checkMoistureConforms(entries, function(err, result) {
            if (!result) {valid = false;}
        })
    }
    if (UserPlant.Temperature == 1) {
        checkTemperatureConforms(entries, function(err, result) {
            if (!result) {valid = false;}
        })
    }
    if (UserPlant.Ph == 1) {
        checkPhConforms(entries, function(err, result) {
            if (!result) {valid = false;}
        })
    }

    return cb([null, valid])
}

function checkMoistureConforms(entries, cb) {
    let valid = true;
    entries.array.forEach(entry => {
        const moisture = entry?.moisture;
        if (!moisture || moisture < MinimumMoisture || moisture > MaximumMoisture) {
            valid = false;
        }
    });
    return cb([null, valid])
}

function checkTemperatureConforms(entries, cb) {
    let valid = true;
    entries.array.forEach(entry => {
        const temp = entry?.temperature;
        if (!temp || temp < MinimumTemp || temp > MaximumTemp) {
            valid = false;
        }
    });
    return cb([null, valid])
}

function checkPhConforms(entries, cb) {
    let valid = true;
    entries.array.forEach(entry => {
        const ph = entry?.ph;
        if (!ph || ph < MinimumPh || ph > MaximumPh) {
            valid = false;
        }
    });
    return cb([null, valid])
}

function getDevice(deviceKey, cb) {
    deviceModel.getDeviceById(deviceKey, function(err, result) {
        if (result) {
            return cb([null, result])
        } else {
            return cb([null, null])
        }
    })
}