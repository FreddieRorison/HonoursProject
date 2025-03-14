const plantModel = require("../models/plantModel.js");
const deviceModel = require("../models/deviceModel.js");
const admin = require('../config/firebase'); // Import Firebase instance
const { Expo } = require('expo-server-sdk');

const expo = new Expo();

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
const OfflineType = 5;

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

    const omitted = await new Promise((resolve, reject) => {
        insertData(device.UserPlantId, entries, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    deviceModel.updateLastOnline(device.Id)

    res.status(200).send(omitted === 0 ? "Success" : "Inserted with " + omitted + " omitted entries;")

    } catch (err) {
        console.error(err);
        res.status(500).send()
    }
    
}

exports.AnalysisEntryPoint = async function () {
    // Get all devices that have been online within last 15 mins and their associated plant Ids
    // Get all devices that have been offline for more than 15 mins if they have an associated plant
    const onlineDevices = await new Promise((resolve, reject) => {
        deviceModel.getOnlineDevices((err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    const offlineDevices = await new Promise((resolve, reject) => {
        deviceModel.getOfflineDevices((err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    if (offlineDevices) {
        for (let i = 0; i < offlineDevices.length; i++) {
            upgradeNotification(offlineDevices[i].UserPlantId, OfflineType);
        }
    }
    if (onlineDevices) {
        for (let i = 0; i < onlineDevices.length; i++) {
            resolveNotification(onlineDevices[i].UserPlantId, OfflineType);
            analyseData(onlineDevices[i].UserPlantId)
        }
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
        if (!date || date > new Date()) {
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
    let omittedEntries = 0;
    try {
        const lastRow = await new Promise((resolve, reject) => {
            plantModel.getLastDataRow(UserPlantId, (err ,result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })
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
        return cb(null, omittedEntries);
    } catch (err) {
        console.error(err)
        return cb(null, omittedEntries);
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

    const plantInfo = await new Promise((resolve, reject) => {
        plantModel.getPlantInfoFromId(plant.PlantInfoId, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    const entries = await new Promise((resolve, reject) => {
        plantModel.getData(UserPlantId, 1, (err, result) => { // Last 1 hour of data
            if (err) return reject(err);
            resolve(result);
        })
    })

    const entriesLong = await new Promise((resolve, reject) => {
        plantModel.getData(UserPlantId, 240, (err ,result) => { // Last 10 days of data
            if (err) return reject(err);
            resolve(result);
        })
    })

    if (!entries) {
        return;
    }

    let tempAvg = 0;
    let phAvg = 0;
    let lastWater = null;

    let i = 0;
    for (i; i < entries.length; i++) {
        tempAvg = tempAvg + entries[i].Temp;
        phAvg = phAvg + entries[i].Ph;
    }

    tempAvg = tempAvg / i
    phAvg = phAvg / i

    if (plant.Moisture == 1) {
        const lastWaterIndex = await new Promise((resolve, reject) => {
            findLastWater(entriesLong, (err ,result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })
        console.log(lastWaterIndex)
        lastWater = new Date(entriesLong[lastWaterIndex].Date.replace(" ", "T"));
    }

    let targetDate = new Date()
    targetDate.setDate(targetDate.getDate()-plantInfo.WateringPeriod)

    if (plant.Moisture == 1 && (targetDate >= lastWater || lastWater == null)) {
        upgradeNotification(plant.Id, MoistureType)
    } else {
        resolveNotification(plant.Id, MoistureType)
    }
    if (plant.Temperature == 1 && (tempAvg < plantInfo.MinTemp)) {
        upgradeNotification(plant.Id, TemperatureType)
    } else {
        resolveNotification(plant.Id, TemperatureType)
    }
    if (plant.Ph == 1 && (phAvg < plantInfo.MinPh)) {
        upgradeNotification(plant.Id, PhLowType)
    } else {
        resolveNotification(plant.Id, PhLowType)
    }
    if (plant.Ph == 1 && (phAvg > plantInfo.MaxPh)) {
        upgradeNotification(plant.Id, PhHighType)
    } else {
        resolveNotification(plant.Id, PhHighType)
    }
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function findLastWater(entries, cb) {
    let considered = 1; // How many elements to the left and right to use when creating the rolling average
    let smoothedAverage = new Array(entries.length - (2*considered)).fill(0);

    for (let i = considered; i < entries.length - considered; i++) {
        let sum = 0;
        let count = 0;
        for (let j = -considered; j <= considered; j++) {
            sum = sum + entries[i+j].Humidity;
            count++;
        }
        smoothedAverage[i - considered] = sum / count;
    }

    let meanDeltaChange = 0;

    for (let i = 1; i < smoothedAverage.length; i++) {
        meanDeltaChange = meanDeltaChange + Math.abs(smoothedAverage[i-1]-smoothedAverage[i]);
    }
    meanDeltaChange = meanDeltaChange / (smoothedAverage.length-1);
    let threshold = meanDeltaChange * 2; // Considers values 2 times the average delta to be a watering event
    let wateringEvent = [];

    for (let i = 1; i < smoothedAverage.length; i++) {
        let moistureDelta = smoothedAverage[i-1] - smoothedAverage[i];
        
        if (moistureDelta >= threshold) {
            wateringEvent.push(i)
        }
    }
    if (wateringEvent.length > 0) {
        return cb(null, wateringEvent[0]-2); 
    } else {
        return cb(null, null);
    }
}

async function upgradeNotification(plantId, notifType) {
    const prevNotif = await new Promise((resolve, reject) => {
        plantModel.getLastNotificationFromType(plantId, notifType, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    if (!prevNotif) {
        plantModel.createNotification(plantId, notifType, function(err, res) {
            if (err) {console.error(err)}
            sendNotification(res)
            return;
        });
        return;
    }

    let comparisonDate = new Date()
    comparisonDate.setHours(comparisonDate.getHours()-6)
    let notificationDate = new Date(prevNotif.Date.replace(" ", "T"))

    if (prevNotif.Resolved == 1) {
        plantModel.createNotification(plantId, notifType, function(err, res) {
            if (err) {console.error(err)}
            sendNotification(res)
            return;
        })
    } else if (prevNotif.Resolved == 0 && prevNotif.SeverityId == 2 && notificationDate <= comparisonDate) {
        plantModel.elevateNotificationSeverity(prevNotif.Id);
        sendNotification(prevNotif.Id)
    } else {
        sendNotification(prevNotif.Id)
    }
}

async function resolveNotification(plantId, notifType) {
    const prevNotif = await new Promise((resolve, reject) => {
        plantModel.getLastNotificationFromType(plantId, notifType, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    if (!prevNotif) { return; }

    if (prevNotif.Resolved) { return; }

    plantModel.resolveNotification(prevNotif.Id);
}

async function sendNotification(notifId) {
    console.log("Send Notification:", notifId)
    
    const notification = [{
        to: "ExponentPushToken[4cLNIPKjvbGC2uNsOozWNY]",
        sound: 'default',
        title: "PlantName",
        body: "Needs Watered",
        data: {screen: "home"},
    }];

    try {
        let chunks = expo.chunkPushNotifications(notification);
        let tickets = [];

        for (let chunk of chunks) {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log(ticketChunk)
            tickets.push(...ticketChunk)
        }
    } catch (err) {
        console.error(err)
    }
}