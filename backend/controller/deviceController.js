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
const Offline = 5;

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

    analyseData(device.UserPlantId)

    if(ommitedEntries == 0) {
        res.status(200).send()
    } else {
        res.status(200).send("Inserted Rows With " + ommitedEntries + "/" + entries.length + " ommitted for being within restricted time window of another entry")
    }
}

//This is not tested
function analyseData(UserPlantId) {
    //Check Each Factor
    //If Factors within normal raneg for 5 mins remove notification
    //If Not within limits for 30 mins issue warning
    //If Not within limits for 12 hours issue bad condition
    //If issuing notification or upgrading notification then send push notification

    plantModel.getPlantFromId(UserPlantId, function(err, plant) {
        if (err) {console.error(err)}
        plantModel.getPlantInfoFromId(plant.PlantInfoId, function(err ,plantInfo) {
            if (err) {console.error(err)}
            if (plant.Moisture == 1) {
                checkMoisture(plant, plantInfo)
            }
            if (plant.Temperature == 1) {
                checkTemperature(plant, plantInfo)
            }
            if (plant.Ph == 1) {
                checkPh(plant, plantInfo)
            }
        })
    })
}

function checkMoisture(plant, plantInfo) {
    // Average Last Half Hour - Is Over Outwith Bounds?
    // If Yes Average last 5 mins - Within Bounds?
    // If No and Notification already submitted - Check 12 hours
    // If outwith 12 hour bound then - Upgrade Notification if Warning submitted more than 60 mins prior
    plantModel.getMoistureData(plant.Id, 168, function(err, rows) {
        if (err) {console.error(err)}

        if (!rows) {
            return;
        }

        let currentValue = rows[0];
        let i = 0;
        let exitLoop = false;

        while (i < rows.length && !exitLoop) {
            if ((rows[i].Humidity-currentValue.Humidity)<-10) {
                exitLoop = true;
                currentValue = rows[i];
            }
            i++
        }
        let date = new Date();
        let rowTime = new Date(currentValue.Date.replace(" ", "T"));

        let daysSinceLastWater = Math.round((rowTime.getTime() - date.getTime()) / 1000 * 60 * 60 * 24)

        if (plantInfo.WateringPeriod < daysSinceLastWater) {
            plantModel.getLastNotificationFromType(plant.Id, MoistureType, function(err, result) {
                if (err) {console.error(err)}
                if (result) {
                    let resultDate = new Date(result.Date.replace(" ", "T"));
                    date.setHours(date.getHours()-12)
                    if (result.Resolved == 0 && resultDate < date) {
                        upgradeNotification(result.Id)
                    } else if (result.Resolved == 1) {
                    plantModel.createNotification(plant.Id, TemperatureType, function(err, notificationId) {
                        if (err) {console.error(err)}
                        sendPushNotification(notificationId)
                    }) 
                    }
                } else {
                    plantModel.createNotification(plant.Id, TemperatureType, function(err, notificationId) {
                        if (err) {console.error(err)}
                        sendPushNotification(notificationId)
                    })
                }
            })
        }
    })
}

function checkTemperature(plant, plantInfo) {
    plantModel.getTemperatureData(plant.Id, 0.5, function(err, result) {
        if (err) {console.error(err)}

        if (!result) {
            return;
        }

        let average = 0;
        let count = 0;
        result.forEach(row => {
            average = average + row.Temp;
            count++;
        })
        average = average / count;
        if (average < plantInfo.MinTemp) {
            plantModel.getLastNotificationFromType(plant.Id, TemperatureType, function(err, notif) {
                if (err) {console.error(err)}
                if (notif) {
                    let date = new Date();
                    let notifTime = new Date(notif.Date.replace(" ", "T"));
                    notifTime.setHours(notifTime.getHours()+12)
                    if (notif.Resolved == 0 && date > notifTime) {
                        upgradeNotification(notif.Id)
                    } else if (notif.Resolved == 1) {
                        plantModel.createNotification(plant.Id, TemperatureType, function(err, notificationId) {
                        sendPushNotification(notificationId)
                        })
                    }
                } else {
                    plantModel.createNotification(plant.Id, TemperatureType, function(err, notificationId) {
                        sendPushNotification(notificationId)
                    })
                }
            })
        } else {
            plantModel.getLastNotificationFromType(plant.Id, TemperatureType, function(err, notif) {
                if (err) {console.error(err)}
                if (notif) {
                    if (notif.Resolved == 0) {
                        plantModel.resolveNotification(notif.Id)
                    }
                }
            })
        }
    })
}

function checkPh(plant, plantInfo) {
    plantModel.getTemperatureData(plant.Id, 0.5, function(err, result) {
        if (err) {console.error(err)}

        if (!result) {
            return;
        }

        let average = 0;
        let count = 0;
        result.forEach(row => {
            average = average + row.Ph;
            count++;
        })
        average = average / count;
        if (average < plantInfo.MinPh) {
            plantModel.getLastNotificationFromType(plant.Id, PhLowType, function(err, notif) {
                if (err) {console.error(err)}
                if (notif) {
                    let date = new Date();
                    let notifTime = new Date(notif.Date.replace(" ", "T"));
                    notifTime.setHours(notifTime.getHours()+12)
                    if (notif.Resolved == 0 && date > notifTime) {
                        upgradeNotification(notif.Id)
                    } else if (notif.Resolved == 1) {
                        plantModel.createNotification(plant.Id, PhLowType, function(err, notificationId) {
                        sendPushNotification(notificationId)
                        })
                    }
                } else {
                    plantModel.createNotification(plant.Id, PhLowType, function(err, notificationId) {
                        sendPushNotification(notificationId)
                    })
                }
            })
        } else if (average > plantInfo.MaxPh) {
            plantModel.getLastNotificationFromType(plant.Id, PhHighType, function(err, notif) {
                if (err) {console.error(err)}
                if (notif) {
                    let date = new Date();
                    let notifTime = new Date(notif.Date.replace(" ", "T"));
                    notifTime.setHours(notifTime.getHours()+12)
                    if (notif.Resolved == 0 && date > notifTime) {
                        upgradeNotification(notif.Id)
                    } else if (notif.Resolved == 1) {
                        plantModel.createNotification(plant.Id, PhHighType, function(err, notificationId) {
                        sendPushNotification(notificationId)
                        })
                    }
                } else {
                    plantModel.createNotification(plant.Id, PhHighType, function(err, notificationId) {
                        sendPushNotification(notificationId)
                    })
                }
            })
        } else {
            plantModel.getLastNotificationFromType(plant.Id, 2, function(err, notif) {
                if (err) {console.error(err)}
                if (notif) {
                    if (notif.Resolved == 0) {
                        plantModel.resolveNotification(notif.Id)
                    }
                }
            })
        }
    })
}

function upgradeNotification(notificationId) {
    plantModel.elevateNotificationSeverity(notificationId);
    sendPushNotification(notificationId)
}

function sendPushNotification(notificationId) {
    // Dont send 2 within an hour
    // Check for the last notification that was marked as sent as guide for last notification time
}

function insertData(UserPlantId, entries, cb) {
    let omittedEntries = 0;
    let previousTime = new Date();


    //This whole bit does not work
    plantModel.getLastDataRow(UserPlantId, function(err, result) {
        if (err) {console.error(err);}
        if (result) {
            previousTime = new Date(result.Date.replace(" ", "T"));
        } else {
            previousTime = new Date()
            previousTime.setFullYear(previousTime.getFullYear() - 1)
        }

        entries.forEach(entry => {
            let entryDate = new Date(entry.timestamp.replace(" ", "T"));
            previousTime.setSeconds(previousTime.getSeconds()+SecondsBetweenEntries)
            if (entryDate < previousTime) {
                plantModel.insertDataRow(UserPlantId,entry);
            } else {
                omittedEntries = omittedEntries + 1;
            }
        });

        return cb(null, omittedEntries)
    })
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