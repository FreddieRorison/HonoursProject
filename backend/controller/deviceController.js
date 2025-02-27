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
const MinutesBetweenEntries = 0.5;

exports.receive_data = function(req, res) {
    const deviceKey = req.body?.AccessKey;
    const entries = req.body?.entries;

    if (!deviceKey) {
        res.status(400).send("Missing Device Key;");
        return;
    }

    if (entries.length < 1) {
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

    if (!device.UserPlantId) {
        res.status(400).send("Device Not Assigned to a Plant;");
        return;
    }

    let conforms = false;

    checkEntriesConform(device.UserPlantId, entries, function(err, result) {
        conforms = result;
    })

    if (!conforms) {
        res.status(400).send("Data Missing or outwith Limits;");
        return;
    }

    let ommitedEntries = 0;

    insertData(device.UserPlantId, entries, function(err, result) {
        ommitedEntries = result;
    })

    if(ommitedEntries == 0) {
        res.status(200).send()
    } else {
        res.status(200).send("Inserted Rows With " + ommitedEntries + "/" + entries.length + " ommitted for being within time window of another entry")
    }

    
}

function insertData(UserPlantId, entries, cb) {
    let omittedEntries = 0;
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
        let entryDate = new Date(entry.timestamp.replace(" ", "T"));
        if (entryDate > previousTime.setMinutes(previousTime.getMinutes()+MinutesBetweenEntries)) {
            plantModel.insertDataRow(UserPlantId,entry);
        } else {
            omittedEntries = omittedEntries + 1;
        }
    });

    return cb(null, omittedEntries)
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
    checkTimestampConforms(entries, function(err, result) {
        if (!result) {valid = false}
    })

    return cb(null, valid)
}

function checkMoistureConforms(entries, cb) {
    let valid = true;
    entries.forEach(entry => {
        const moisture = entry?.moisture;
        if (!moisture || moisture < MinimumMoisture || moisture > MaximumMoisture) {
            valid = false;
        }
    });
    return cb(null, valid)
}

function checkTemperatureConforms(entries, cb) {
    let valid = true;
    entries.forEach(entry => {
        const temp = entry?.temperature;
        if (!temp || temp < MinimumTemp || temp > MaximumTemp) {
            valid = false;
        }
    });
    return cb(null, valid)
}

function checkPhConforms(entries, cb) {
    let valid = true;
    entries.forEach(entry => {
        const ph = entry?.ph;
        if (!ph || ph < MinimumPh || ph > MaximumPh) {
            valid = false;
        }
    });
    return cb(null, valid)
}

function checkTimestampConforms(entries, cb) {
    let valid = true;
    let date = new Date();
    entries.forEach(entry => {
        let timestamp = new Date(entry.timestamp.replace(" ", "T"));
        if (!timestamp) {
            valid = false;
        } else if (timestamp > date) {
            valid = false;
        }
    });
    return cb(null, valid)
}

function getDevice(deviceKey, cb) {
    deviceModel.getDeviceByKey(deviceKey, function(err, result) {
        if (result) {
            return cb(null, result)
        } else {
            return cb(null, null)
        }
    })
}