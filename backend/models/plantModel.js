const db = require('better-sqlite3')('./database.db');
const uuid = require('uuid');

class PlantModel {
    init() {
        this.db = db
    }

    create(name, userId, plantInfoId, moisture, temperature, ph, cb) {
        const id = uuid.v4();

        moisture = moisture ? 1 : 0;
        temperature = temperature ? 1 : 0;
        ph = ph ? 1 : 0;
        
        this.db.prepare("INSERT INTO User_plants (Id, UserId, Name, PlantInfoId, Moisture, Temperature, Ph) VALUES (?,?,?,?,?,?,?)").run(id, userId, name, plantInfoId, moisture, temperature, ph)
        return cb(null, id)
    }

    createNotification(UserPlantId, Type, cb) {
        const id = uuid.v4();
        let date = new Date();
        let result = this.db.prepare("INSERT INTO Notification_History (Id, UserPlantId, TypeId, SeverityId, Date, Sent, Resolved) VALUES (?,?,?,?,?,?,?)").run(id, UserPlantId, Type, 2, date.toISOString(), 0, 0)
        return cb(null, id)
    }

    getLastNotificationFromType(UserPlantId, Type, cb) {
        const rows = this.db.prepare("SELECT * FROM Notification_History WHERE UserPlantId = ? AND TypeId = ? ORDER BY Date DESC").all(UserPlantId, Type);
        if (rows.length > 0) {
            return cb(null, rows[0]);
        } else {
            return cb(null, null)
        }
    }

    resolveNotification(notificationId) {
        this.db.prepare("UPDATE Notification_History SET Resolved = 1 WHERE Id = ?").run(notificationId);
    }

    markNotificationSent(notificationId) {
        this.db.prepare("UPDATE Notification_History SET Sent = 1 WHERE Id = ?").run(notificationId);
    }

    elevateNotificationSeverity(notificationId) {
        this.db.prepare("UPDATE Notification_History SET SeverityId = 3 WHERE Id = ?").run(notificationId);
    }

    getPlantFromId(id, cb) {
        const rows = this.db.prepare("SELECT * FROM User_Plants WHERE Id = ?").all(id);
        if (rows.length > 0) {
            return cb(null, rows[0]);
        } else {
            return cb(null, null)
        }
    }

    getPlants(userId, cb) {
        const rows = this.db.prepare("SELECT * FROM User_Plants WHERE UserId = ?").all(userId);
        if (rows.length > 0) {
            return cb(null, rows);
        } else {
            return cb(null, null)
        }
    }

    getPlantTypes(cb) {
        const rows = this.db.prepare("SELECT Id, CommonName FROM Plant_Info").all();
        if (rows.length > 0) {
            return cb(null, rows);
        } else {
            return cb(null, null)
        }
    }

    getPlantInfoFromId(id, cb) {
        const rows = this.db.prepare("SELECT * FROM Plant_Info WHERE Id = ?").all(id);
        if (rows.length > 0) {
            return cb(null, rows[0]);
        } else { 
            return cb(null, null)
        }
    }

    delete(id) {
        this.db.prepare("DELETE FROM User_plants WHERE User_plants.Id = ?").run(id);
    }

    deletePlantData(id) {
        this.db.prepare("DELETE FROM Data WHERE UserPlantId = ?").run(id);
    }

    editName(id, Name) {
        this.db.prepare("UPDATE User_Plants SET Name = ? WHERE Id = ?").run(Name, id);
    }

    editPlantInfoId(id, PlantType) {
        this.db.prepare("UPDATE User_plants SET PlantInfoId = ? WHERE Id = ?").run(PlantType, id);
    }

    editMoisture(id, moisture) {
        this.db.prepare("UPDATE User_plants SET Moisture = ? WHERE Id = ?").run(moisture, id);
    }

    editTemperature(id, temperature) {
        this.db.prepare("UPDATE User_plants SET Temperature = ? WHERE Id = ?").run(temperature, id);
    }

    editPh(id, ph) {
        this.db.prepare("UPDATE User_plants SET Ph = ? WHERE Id = ?").run(ph, id);
    }

    getData(id, hours, cb) {
        const rows = this.db.prepare("SELECT Id, Date, Humidity, Ph, Temp FROM Data WHERE UserPlantId = ? AND Date >= datetime('now',?) ORDER BY Date DESC").all(id, `-${hours} hour`);
        if (rows.length > 0) {
            return cb(null, rows);
        } else {
            return cb(null, null)
        }
    }

    getMoistureData(id, hours, cb) {
        const rows = this.db.prepare("SELECT Id, Date, Humidity FROM Data WHERE UserPlantId = ? AND Date >= datetime('now',?) ORDER BY Date DESC").all(id, `-${hours} hour`);
        if (rows.length > 0) {
            return cb(null, rows);
        } else {
            return cb(null, null)
        }
    }

    getTemperatureData(id, hours, cb) {
        const rows = this.db.prepare("SELECT Id, Date, Temp FROM Data WHERE UserPlantId = ? AND Date >= datetime('now',?) ORDER BY Date DESC").all(id, `-${hours} hour`);
        if (rows.length > 0) {
            return cb(null, rows);
        } else {
            return cb(null, null)
        }
    }

    getPhData(id, hours, cb) {
        const rows = this.db.prepare("SELECT Id, Date, Ph FROM Data WHERE UserPlantId = ? AND Date >= datetime('now',?) ORDER BY Date DESC").all(id, `-${hours} hour`);
        if (rows.length > 0) {
            return cb(null, rows);
        } else {
            return cb(null, null)
        }
    }

    getNotifications(id, cb) {
        const rows = this.db.prepare("SELECT Notification_History.Id, Notification_History.UserPlantId, Type.Name, Notification_History.SeverityId, Notification_History.Date, Notification_History.Resolved FROM Type, Notification_History WHERE Notification_History.TypeId = Type.Id AND UserPlantId = ? ORDER BY Date DESC LIMIT 5").all(id);
        if (rows.length > 0) {
            return cb(null, rows);
        } else {
            return cb(null, null)
        }
    }

    insertDataRow(UserPlantId,entry) {
        const id = uuid.v4();
        let humidity = entry.moisture || 0;
        let ph = entry.ph || 0;
        let temperature = entry.temperature || 0;

        this.db.prepare("INSERT INTO Data (Id, UserPlantId, Date, Humidity, Ph, Temp) VALUES (?,?,?,?,?,?)").run(id, UserPlantId, entry.timestamp, humidity, ph, temperature)
    }

    getLastDataRow(UserPlantId, cb) {
        const rows = this.db.prepare("SELECT * FROM Data WHERE UserPlantId = ? ORDER BY Date DESC LIMIT 1").all(UserPlantId);
        if (rows.length > 0) {
            return cb(null, rows[0]);
        } else {
            return cb(null, null)
        }
    }

    removeAllData() {
        this.db.prepare("DELETE FROM Data WHERE Data.Id = Data.Id").run();
    }
}

const model = new PlantModel;
model.init();

module.exports = model;