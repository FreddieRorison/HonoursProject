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
const SecondsBetweenEntries = 50;

const MoistureType = 1;
const TemperatureType = 2;
const PhHighType = 3;
const PhLowType = 4;
const Offline = 5; // Repeatedly check if device is offline

exports.receive_data = async function(req, res) {
    try {
    const deviceKey = req.body?.AccessKey;
    const entries = req.body?.entries;

    if (!deviceKey) {
        res.status(400).send({error: "Missing Device Key"})
        return;
    }

    if (entries.length < 1) {
        res.status(400).send({error: "Missing Data;"})
        return;
    }

    const device = await new Promise((resolve, reject) => {
        deviceModel.getDeviceByKey(deviceKey, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    if (!device) {
        res.status(400).send({error: "Device Not Found;"});
        return;
    }

    if (!device.UserPlantId) {
        res.status(400).send({error: "Device Not Assigned to a plant;"})
    }

    const result = await checkEntriesConform(device.UserPlantId, entries);
    if (!result) {
        res.status(400).send({error: "Data missing or outwith limits;"})
        return;
    }

    const omitted = await insertData(device.UserPlantId, entries)

    deviceModel.updateLastOnline(device.Id)

    res.status(200).send(omitted === 0 ? "Success" : "Inserted with " + omitted + " omitted entries;")

    } catch (err) {
        console.error(err);
        res.status(500).send()
    }
    
}

async function checkEntriesConform(UserPlantId, entries) {
    try {
    const plant = await new Promise((resolve, reject) => {
        plantModel.getPlantFromId(UserPlantId, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    valid = true;

    for (let i = 0; i < entries.length; i++) {
        if (plant.Moisture && (entries[i].moisture < MinimumMoisture || entries[i].moisture > MaximumMoisture)) {
            valid = false
        }
        if (plant.Temperature && (entries[i].temperature < MinimumTemp || entries[i].temperature > MaximumTemp)) {
            valid = false
        }
        if (plant.Ph && (entries[i].ph < MinimumPh || entries[i].ph > MaximumPh)) {
            valid = false
        }

        let date = new Date(entries[i].timestamp.replace(" ", "T"));
        if (!date || timestamp > new Date()) {
            valid = false;
        }
    }

    return valid;

    } catch (err) {
        console.error(err)
        return false;
    }
}

async function insertData(UserPlantId, entries, cb) {
    try {
        const lastRow = await plantModel.getLastDataRow(UserPlantId);
        let previousTime = lastRow ? new Date(lastRow.Date.replace(" ", "T")) : new Date(Date.now() -365*24*60*60*1000)

        for (let i = 0; i < entries.length; i++) {
            let entryDate = new Date(entries[i].timestamp.replace(" ", "T"))
            let NextAllowedTime = new Date(previousTime.getTime() + SecondsBetweenEntries * 1000)

            if (entryDate => NextAllowedTime) {
                await plantModel.insertDataRow(UserPlantId, entries[i]);
                previousTime = new Date(entryDate.getTime())
            } else {
                omittedEntries++;
            }
        }
        return omittedEntries;
    } catch (err) {
        console.error(err)
        return omittedEntries;
    }
}

async function analyseData(UserPlantId) {
    try {

    const plant = await new Promise((resolve, reject) => {
        plantModel.getPlantFromId(UserPlantId, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    const entries = await new Promise((resolve, reject) => {
        plantModel.getData(UserPlantId, 12, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    for (let i = 0; i < entries.length; i++) {
        // Maybe 2 loops and 1 continues the rest of the data after the temp and ph is checked
        // like first loop does last 2 hours and the second loop does 2-768 hours
    }

    } catch (err) {
        console.error(err);
        return false;
    }
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