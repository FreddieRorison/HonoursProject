const jwt = require("jsonwebtoken")
const validator = require('email-validator');
const userModel = require("../models/userModel.js");
const plantModel = require("../models/plantModel.js");
const deviceModel = require("../models/deviceModel.js");

const MaxPlantNameLength = 28;
const MinPlantNameLength = 4;

exports.create_account = function(req, res) {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    var firstname = req.body.firstname;
    var email = req.body.email;
    var password = req.body.password;
    if (!firstname || !email || !password) { res.status(401).send({error:"Form Incomplete"}); return;}
    if(!validator.validate(email)) {res.status(401).send({error: "Email invalid"}); return;}

    if (!passwordRegex.test(password)) {
        res.status(400).send({error: "Password does not meet requirements"})
        return;
    }

    userModel.getfromEmail(email, function (err, user) {
        if (err) {res.status(401).send({error:"Error"});return;}
        if(user) {res.status(401).send({error:"User already exists!"});return;}
        userModel.create(firstname, email, password);
        res.status(200).send("User Created!");
        return;
    })
}

exports.handle_login = function(req, res) {
    res.status(200).send();
}

exports.handle_mobile_login = function(req, res) {
    console.log("Mobile Login")
    res.status(200).send();
}

exports.auth_me = function(req, res) {
    getUser(req.body?.jwt.split(";")[0], function(err, result) {
        if (err) { console.error(err)}
        if (result) {
            res.status(200).send({
                "userId":result.Id,
                "firstname":result.Firstname,
                "email":result.Email
            });
        } else {
            res.status(403).send();
        }
    })
    
}

exports.create_plant = async function(req, res) {
    try {
    const id = req.body?.jwt.split(";")[0]
    const name = req.body.name;
    const plantInfoId = req.body.plantInfoId;
    const moisture = req.body.moisture;
    const temperature = req.body.temperature;
    const ph = req.body.ph;
    const deviceId = req.body.deviceId;

    if (!id || !name || !plantInfoId) {
        error = error + "Missing Form Data;";
    }

    const device = await new Promise((resolve, reject) => {
        deviceModel.getDeviceById(deviceId, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    const Type = await new Promise((resolve, reject) => {
        plantModel.getPlantInfoFromId(plantInfoId, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    const user = await new Promise((resolve, reject) => {
        getUser(id, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    const plantType = await Type;
    const userResult = await user;

    if (!plantType) {
        res.status(401).send({error:"Plant Type Does Not Exist;"})
        return;
    }

    if (name.length > 28) {
        res.status(401).send({error:"Name too long;"})
        return;
    }

    if (name.length < 4) {
        res.status(401).send({error:"Name too short;"})
        return;
    }

    const plantResult = await new Promise((resolve, reject) => {
        plantModel.create(name, userResult.Id, plantType.Id, moisture, temperature, ph, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    if (device) {
        if (device.UserId !== user.Id) {
            res.status(403).send({error:"Device is not owned by user;"})
            return;
        }

        if (device.UserPlantId) {
            res.status(400).send({error:"Device already assigned to a device;"})
            return;
        }

        deviceModel.edituserPlantId(plantResult, deviceId)
    }

    res.status(200).send({plantId: plantResult});

    } catch (err) {
        console.error(err);
        res.status(500).send() 
    }
}

exports.edit_plant_name = function(req, res) {
    const id = req.body?.jwt.split(";")[0]
    const plantId = req.body?.plantId
    const name = req.body?.name;

    let error = "";

    if (!id || !plantId || !name) {
        return res.status(400).send("Missing Form Data;")
    }

    if (name.length > MaxPlantNameLength || name.length < MinPlantNameLength) {
        return res.status(400).send("Name Length Requirements Not Met;")
    }

    getUser(id, function(err, result) {
        plantModel.getPlantFromId(plantId, function(err, res) {
            if (!res) {
                error = error + "Plant does not exist;";return
            }
            if (result.Id != res.UserId) {
                error = error + "User does not own plant;";return
            }
        })
    })
    if (error) {
        res.status(400).send(error)
    } else {
        plantModel.editName(plantId, name)
        res.status(200).send()
    }
}

exports.edit_plant_infoId = function(req, res) {
    const id = req.body?.jwt.split(";")[0]
    const plantId = req.body?.plantId
    const plantInfoId = req.body?.plantInfoId

    if (!id || !plantId || !plantInfoId) {
        res.status(400).send("Missing Form Data;")
    }

    let error = "";

    getUser(id, function(err, result) {
        if (err) {console.error(err)}
        plantModel.getPlantFromId(plantId, function(err, plantResult) {
            if (err) {console.error(err)}
            plantModel.getPlantInfoFromId(plantInfoId, function(err, plantInfoResult) {
                if (err) {console.error(err)}
                if (!plantResult) {error = error + "Plant Does Not Exist;";return}
                if (!plantInfoResult) {error = error + "Plant Type Does Not Exist";return}
                if (result.Id !== plantResult.UserId) {error = error + "Plant Not Owned By User;";return}
            })
        })
    })

    if (error) {
        res.status(400).send(error)
    } else {
        plantModel.editPlantInfoId(plantId, plantInfoId)
        res.status(200).send()
    }
}

exports.edit_plant_moisture = async function(req, res) {
    try {
    const id = req.body?.jwt.split(";")[0]
    const plantId = req.body?.plantId
    const moisture = req.body?.moisture;

    if (!id || !plantId) {
        res.status(400).send({errpr: "Missing Form Data;"});
        return;
    }

    if (moisture !== true && moisture !== false) {
        res.status(400).send({error: "Missing form Data;"});
        return;
    }

    const user = await new Promise((resolve, reject) => {
        getUser(id, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    const plant = await new Promise((resolve, reject) => {
        plantModel.getPlantFromId(plantId, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    if (!plant) {
        res.status(401).send({error: "Plant Does Not Exist;"})
    }

    if (plant.UserId !== user.Id) {
        res.status(401).send({error: "User Does Not Own Plant;"})
    }

    let moist = moisture ? 1: 0;
    plantModel.editMoisture(plantId, moist)

    res.status(200).send()

    } catch (err) {
        console.error(err);
        res.status(500).send()
    }
}

exports.edit_plant_temperature = async function(req, res) {
    try {
        const id = req.body?.jwt.split(";")[0]
        const plantId = req.body?.plantId
        const temperature = req.body?.temperature;
    
        if (!id || !plantId) {
            res.status(400).send({errpr: "Missing Form Data;"});
            return;
        }
    
        if (temperature !== true && temperature !== false) {
            res.status(400).send({error: "Missing form Data;"});
            return;
        }
    
        const user = await new Promise((resolve, reject) => {
            getUser(id, (err ,result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })
    
        const plant = await new Promise((resolve, reject) => {
            plantModel.getPlantFromId(plantId, (err ,result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })
    
        if (!plant) {
            res.status(401).send({error: "Plant Does Not Exist;"})
        }
    
        if (plant.UserId !== user.Id) {
            res.status(401).send({error: "User Does Not Own Plant;"})
        }
    
        let temp = temperature ? 1: 0;
        plantModel.editTemperature(plantId, temp)
    
        res.status(200).send()
    
        } catch (err) {
            console.error(err);
            res.status(500).send()
        }
}

exports.edit_plant_ph = async function(req, res) {
    try {
        const id = req.body?.jwt.split(";")[0]
        const plantId = req.body?.plantId
        const ph = req.body?.ph;
    
        if (!id || !plantId) {
            res.status(400).send({errpr: "Missing Form Data;"});
            return;
        }
    
        if (ph !== true && ph !== false) {
            res.status(400).send({error: "Missing form Data;"});
            return;
        }
    
        const user = await new Promise((resolve, reject) => {
            getUser(id, (err ,result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })
    
        const plant = await new Promise((resolve, reject) => {
            plantModel.getPlantFromId(plantId, (err ,result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })
    
        if (!plant) {
            res.status(401).send({error: "Plant Does Not Exist;"})
        }
    
        if (plant.UserId !== user.Id) {
            res.status(401).send({error: "User Does Not Own Plant;"})
        }
    
        let phnew = ph ? 1: 0;
        plantModel.editPh(plantId, phnew)
    
        res.status(200).send()
    
        } catch (err) {
            console.error(err);
            res.status(500).send()
        }
}

exports.remove_plant = async function(req, res) {
    try {
    const id = req.body?.jwt.split(";")[0]
    const plantId = req.body?.plantId

    if (!plantId || !id) {
        return res.status(403).send();
    }

    const user = await new Promise((resolve, reject) => {
        getUser(id, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    const plant = await new Promise((resolve, reject) => {
        plantModel.getPlantFromId(plantId, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    if (!plant) {
        res.status(400).send({error: "Plant Does not Exist;"})
        return;
    }

    if (plant.UserId !== user.Id) {
        res.status(403).send("user does not own plant;")
        return;
    }

    plantModel.delete(plantId)

    res.status(200).send()

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

exports.get_plant_by_id = async function(req, res) {
    try {
    const id = req.body?.jwt.split(";")[0]
    const plantId = req.body?.plantId

    const user = await new Promise((resolve, reject) => {
        getUser(id, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    const plant = await new Promise((resolve, reject) => {
        plantModel.getPlantFromId(plantId, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    if (!plant) {
        res.status(400).send({error: "Plant does not exist;"})
        return;
    }
    if (plant.UserId !== user.Id) {
        res.status(403).send({error: "User does not own plant;"})
        return;
    }

    res.status(200).send(plant);

    } catch (err) {
        console.error(err);
        res.status(500).send()
    }
    

}

exports.get_plants = async function(req, res) {
    try {
    const id = req.body?.jwt.split(";")[0]

    const user = await new Promise((resolve, reject) => {
        getUser(id, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    const plants = await new Promise((resolve, reject) => {
        plantModel.getPlants(user.Id, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    const resultData = await Promise.all(
        plants.map(async (plant) => {

            const plantInfo = await new Promise((resolve, reject) => {
                plantModel.getPlantInfoFromId(plant.PlantInfoId, (err, result) => {
                    if (err) return reject(err);
                    resolve (result);
                })
            })

            const device = await new Promise((resolve, reject) => {
                deviceModel.getDeviceByPlantId(plant.Id, (err ,result) => {
                    if (err) return reject(err);
                    resolve(result);
                })
            })

            return {
                Id: plant.Id,
                Name: plant.Name,
                Type: plantInfo?.CommonName,
                Device: device?.Name || "No Device"
            }
        })
    )
        
    res.status(200).send(resultData)
    } catch (err) {
        console.error(err); res.status(500).send();
    }
}

exports.get_plant_info_by_id = async function(req, res) {
    try {
        const plantInfoId = req.body?.plantInfoId

        const type = await new Promise((resolve, reject) => {
            plantModel.getPlantInfoFromId(plantInfoId, (err ,result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })

        const result = await type;

        res.status(200).send(type)

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

exports.get_plant_types = async function(req, res) {
    try {
        const types = await new Promise((resolve, reject) => {
            plantModel.getPlantTypes((err ,result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })

        const result = await types;

        res.status(200).send(result);

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

exports.get_plant_moisture_data = function(req, res) {
    const id = req.body?.jwt.split(";")[0]
    const plantId = req.body?.plantId

    let error = '';
    let data = {};

    if (!plantId || !id) {
        res.status(400).send("Missing Form Data"); return
    }

    getUser(id, function(err, result) {
        if (err) {console.error(err)}
        plantModel.getPlantFromId(plantId, function(err, plantRes) {
            if (err) {console.error(err)}
            if (!plantRes) {error = "Plant does not exist";return}
            if (result.Id !== plantRes.UserId) {error = "User does not own plant;";return}
            plantModel.getMoistureData(plantId, 6, function(err, dataRes) {
                if (err) {console.error(err)}
                data = dataRes;
            })
        })     
    })
    if (error) {
        res.status(400).send(error)
    } else {
        res.status(200).send(data)
    }
}

exports.get_plant_temp_data = function(req, res) {
    const id = req.body?.jwt.split(";")[0]
    const plantId = req.body?.plantId

    let error = '';
    let data = {};

    if (!plantId || !id) {
        res.status(400).send("Missing Form Data"); return
    }

    getUser(id, function(err, result) {
        if (err) {console.error(err)}
        plantModel.getPlantFromId(plantId, function(err, plantRes) {
            if (err) {console.error(err)}
            if (!plantRes) {error = "Plant does not exist";return}
            if (result.Id !== plantRes.UserId) {error = "User does not own plant;";return}
            plantModel.getTemperatureData(plantId, 6, function(err, dataRes) {
                if (err) {console.error(err)}
                data = dataRes;
            })
        })     
    })
    if (error) {
        res.status(400).send(error)
    } else {
        res.status(200).send(data)
    }
}

exports.get_plant_ph_data = function(req, res) {
    const id = req.body?.jwt.split(";")[0]
    const plantId = req.body?.plantId

    let error = '';
    let data = {};

    if (!plantId || !id) {
        res.status(400).send("Missing Form Data"); return
    }

    getUser(id, function(err, result) {
        if (err) {console.error(err)}
        plantModel.getPlantFromId(plantId, function(err, plantRes) {
            if (err) {console.error(err)}
            if (!plantRes) {error = "Plant does not exist";return}
            if (result.Id !== plantRes.UserId) {error = "User does not own plant;";return}
            plantModel.getPhData(plantId, 6, function(err, dataRes) {
                if (err) {console.error(err)}
                data = dataRes;
            })
        })     
    })
    if (error) {
        res.status(400).send(error)
    } else {
        res.status(200).send(data)
    }
}

exports.get_plant_status = async function(req, res) {
    try {
        const id = req.body?.jwt.split(";")[0];
        const plantId = req.body?.plantId;

        if (!id || !plantId) {
            res.status(400).send({error: "Missing Form Data;"})
        }

        const user = await new Promise((resolve, reject) => {
            getUser(id, (err ,result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })

        const plant = await new Promise((resolve, reject) => {
            plantModel.getPlantFromId(plantId, (err ,result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })

        if (!plant) {
            res.status(400).send({error: "Plant does not exist;"})
            return;
        }

        if (user.Id !== plant.UserId) {
            res.status(403).send({error: "User does not own plant"})
            return;
        }

        const notifications = await new Promise((resolve, reject) => {
            plantModel.getNotifications(plantId, (err ,result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })

        let currentStatus = 1;

        if (notifications) {
            notifications.forEach(notif => {
                if (notif.SeverityId > currentStatus && notif.Resolved == 0) {
                    currentStatus = notif.SeverityId;
                }
            })
        }
        
        res.status(200).send({currentStatus})


    } catch (err) {
        console.error(err);
        res.status(500).send()
    }
}

exports.get_notifications = async function(req, res) {
    try {
    const id = req.body?.jwt.split(";")[0]
    const plantId = req.body?.plantId

    if (!plantId || !id) {
        res.status(400).send({error: "Missing Form Data;"}); 
        return;
    }

    const user = await new Promise((resolve, reject) => {
        getUser(id, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    const plant = await new Promise((resolve, reject) => {
        plantModel.getPlantFromId(plantId, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    if (!plant) {
        res.status(400).send({error: "Plant not found;"});
        return;
    }

    if (user.Id !== plant.UserId) {
        res.status(403).send({error: "user does not own plant;"})
        return;
    }

    const notifications = await new Promise((resolve, reject) => {
        plantModel.getNotifications(plantId, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    res.status(200).send({notifications})

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

exports.create_device = async function(req, res) {
    try {
    const id = req.body?.jwt.split(";")[0]
    const name = req.body.name
    const description = req.body.description

    if (!id || !name) {
        res.status(400).send({error: "Missing Form Data;"});
        return;
    }

    if (name.length > 28) {
        res.status(400).send({error: "Name too long;"})
    }

    if (name.length < 3) {
        res.status(400).send({error: "Name too short;"})
    }

    if (description.length > 48) {
        res.status(400).send({error: "Description too long;"})
    }

    const user = await new Promise((resolve, reject) => {
        getUser(id, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    const deviceId = await new Promise((resolve, reject) => {
        deviceModel.create(name, description, user.Id, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    res.status(200).send({DeviceId: deviceId})

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

exports.edit_device_name = async function(req, res) {
    try {
        const id = req.body?.jwt.split(";")[0]
        const name = req.body.name
        const deviceId = req.body.deviceId

        if (!id || !name || !deviceId) {
            return res.status(400).send("Missing Data;")
        }
    
        if (name.length > 28) {
            return res.status(400).send("Name Too Long;")
        }
    
        if (name.length < 4) {
            return res.status(400).send("Name Too Short;")
        }

        const user = await new Promise((resolve, reject) => {
            getUser(id, (err ,result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })

        const device = await new Promise((resolve, reject) => {
            deviceModel.getDeviceById(deviceId, (err ,result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })

        if (!user || !device) {
            res.status(400).send({error: "User or Device does not exist;"})
            return;
        }

        if (user.Id !== device.UserId) {
            res.status(401).send({error: "User does not own device;"})
            return;
        }

        deviceModel.editName(name, deviceId);

        res.status(200).send()

    } catch (err) {
        console.error(err);
        return;
    }
}

exports.edit_device_description = async function(req, res) {
    try {
        const id = req.body?.jwt.split(";")[0]
        const description = req.body.description
        const deviceId = req.body.deviceId

        if (!id || !description || !deviceId) {
            return res.status(400).send("Missing Data;")
        }
    
        if (description.length > 48) {
            return res.status(400).send("Description Too Long;")
        }

        const user = await new Promise((resolve, reject) => {
            getUser(id, (err ,result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })

        const device = await new Promise((resolve, reject) => {
            deviceModel.getDeviceById(deviceId, (err ,result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })

        if (!user || !device) {
            res.status(400).send({error: "User or Device does not exist;"})
            return;
        }

        if (user.Id !== device.UserId) {
            res.status(401).send({error: "User does not own device;"})
            return;
        }

        deviceModel.editDescription(description, deviceId);

        res.status(200).send()

    } catch (err) {
        console.error(err);
        return;
    }
}

exports.edit_assigned_plant = async function(req, res) {
    try {
    const id = req.body?.jwt.split(";")[0]
    const userPlantId = req.body.userPlantId;
    const deviceId = req.body.deviceId;

    const user = await new Promise((resolve, reject) => {
        getUser(id, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    const plant = await new Promise((resolve, reject) => {
        plantModel.getPlantFromId(userPlantId, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    if (user.Id !== plant.UserId) {
        res.status(403).send({error: "User does not own plant;"})
    }

    const targetDevice = await new Promise((resolve, reject) => {
        deviceModel.getDeviceById(deviceId, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    const oldDevice = await new Promise((resolve, reject) => {
        deviceModel.getDeviceByPlantId(userPlantId, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    if (oldDevice.Id == targetDevice) {
        res.status(200).send()
        return;
    }

    if (!plant) {
        res.status(400).send({error: "Plant does not exist;"})
        return;
    }

    if (!targetDevice && deviceId !== "none") {
        res.status(400).send({error: "Device does not exist;"})
        return;
    }

    if (oldDevice) {
        deviceModel.edituserPlantId(null, oldDevice.Id);
    }

    if (deviceId !== "none") {
        deviceModel.edituserPlantId(plant.Id, targetDevice.Id)
    }

    res.status(200).send();

    } catch (err) {
        console.error(err);
        res.status(500).send()
    }
}

exports.generate_new_device_token = async function(req, res) {
    try {
    const id = req.body?.jwt.split(";")[0]
    const deviceId = req.body.deviceId

    if (!id || !deviceId) {
        res.status(400).send("Missing Data");
        return;
    }

    const user = await new Promise((resolve, reject) => {
        getUser(id, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    const device = await new Promise((resolve, reject) => {
        deviceModel.getDeviceById(deviceId, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    if (device.UserId !== user.Id) {
        res.status(401).send({error: "User does not own device;"});
        return;
    }

    const token = await new Promise((resolve, reject) => {
        deviceModel.changeAccessKey(deviceId, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    res.status(200).send({accessKey: token})

    } catch (err) {
        console.error(err); res.status(500).send()
    }
}

exports.remove_device = async function(req, res) {
    try {
    const id = req.body?.jwt.split(";")[0]
    const deviceId = req.body.deviceId

    if (!id || !deviceId) {
        res.status(400).send("Missing Data")
    }

    const user = await new Promise((resolve, reject) => {
        getUser(id, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    const device = await new Promise((resolve, reject) => {
        deviceModel.getDeviceById(deviceId, (err ,result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })

    if (!device) {
        res.status(400).send({error: "Device not found;"})
        return;
    }

    if (device.UserId !== user.Id) {
        res.status(403).send({error: "User does not own device;"})
        return;
    }

    deviceModel.delete(deviceId);
    
    res.status(200).send();

    } catch (err) {
        console.error(err);
        res.status(500).send()
    }
}

exports.get_device_by_id = async function(req, res) {
    try {
        const id = req.body?.jwt.split(";")[0]
        const deviceId = req.body.deviceId

        if (!id || !deviceId) {
            res.status(400).send({error: "Missing Form Data"});
            return;
        }

        const user = await new Promise((resolve, reject) => {
            getUser(id, (err ,result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })

        const device = await new Promise((resolve, reject) => {
            deviceModel.getDeviceById(deviceId, (err ,result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })

        if (user.Id !== device.UserId) {
            res.status(403).send({error: "User Does not own device"});
            return;
        }

        res.status(200).send(device);

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

exports.get_device_by_plant_id = async function(req, res) {
    try {
        const id = req.body?.jwt.split(";")[0]
        const plantId = req.body.plantId

        if (!id || !plantId) {
            res.status(400).send({error: "Missing Form Data"});
            return;
        }

        const user = await new Promise((resolve, reject) => {
            getUser(id, (err ,result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })

        const device = await new Promise((resolve, reject) => {
            deviceModel.getDeviceByPlantId(plantId, (err ,result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })

        if (user.Id !== device.UserId) {
            res.status(403).send({error: "User Does not own device"});
            return;
        }

        res.status(200).send({device});

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

exports.get_device_access_key = function(req, res) {
    const id = req.body?.jwt.split(";")[0]
    const deviceId = req.body.deviceId

    if (!id || !deviceId) {
        res.status(400).send("Missing Form Data;")
    }

    let error = "";
    let data = {};

    getUser(id, function(err, result) {
        if (err) {console.error(err);return}
        deviceModel.getDeviceById(deviceId, function(err, res) {
            if (err) {console.error(err);return}
            if (!res) {error = error + "Device Does not exist;";return}
            if (result.Id != res.UserId) {error = error + "User does not own Device";return}
            data = res
        })
    })
    if (error) {
        res.status(400).send(error)
    } else {
        res.status(200).send({
            "Id":data.Id,
            "AccessKey":data.AccessKey
        })
    }
}

exports.get_unassigned_devices = async function(req, res) {
    try {
        const id = req.body?.jwt.split(";")[0]

        const user = await new Promise((resolve, reject) => {
            getUser(id, (err ,result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })

        const devices = await new Promise((resolve, reject) => {
            deviceModel.getUnAssignedDevices(user.Id, (err ,result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })

    res.status(200).send({devices})
    } catch (err) {
        console.error(err); res.status(500).send()
    }
}

exports.get_devices = async function(req, res) {
    try {
        const id = req.body?.jwt.split(";")[0]

        const user = await new Promise((resolve, reject) => {
            getUser(id, (err ,result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })

        const devices = await new Promise((resolve, reject) => {
            deviceModel.getDevices(user.Id, (err ,result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })

    res.status(200).send(devices)
    } catch (err) {
        console.error(err); res.status(500).send()
    }
}

exports.get_firstname = async function(req, res) {
    try {
        const id = req.body?.jwt.split(";")[0]

        const user = await new Promise((resolve, reject) => {
            getUser(id, (err ,result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })

    res.status(200).send({firstname: user.Firstname})
    } catch (err) {
        console.error(err); res.status(500).send()
    }
}

exports.register_notification_token = async function (req, res) {
    try {
        const id = req.body?.jwt.split(";")[0]
        const token = req.body.notificationToken;

        const user = await new Promise((resolve, reject) => {
            getUser(id, (err ,result) => {
                if (err) return reject(err);
                resolve(result);
            })
        })

        if (!user || !token) {
            res.status(400).send({error: "Missing Form Data"})
            return;
        }

        userModel.updateNotificationToken(user.Id, notificationToken)

    } catch (err) {
        console.error(err)
        res.status(500).send()
    }
}

function getUser(token, cb) {
    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        userModel.getfromId(payload.userId, function(err, user) {
            if (err) {console.warn(err); return cb(null, null);}
            return cb(null, user);
        }) 
    } catch (e) {
        console.warn(e);
        return cb(null, null);
    }
}