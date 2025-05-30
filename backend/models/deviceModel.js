const db = require('better-sqlite3')('./database.db');
const uuid = require('uuid');

class DeviceModel {
    init() {
        this.db = db
    }

    create(name, description, userId, cb) {
        const id = uuid.v4()
        const token = uuid.v6()
        
        this.db.prepare("INSERT INTO Devices (Id, UserId, AccessKey, Name, Description) VALUES (?,?,?,?,?)").run(id, userId, token, name, description)
        return cb(null, id)
    }

    delete(id) {
        this.db.prepare("DELETE FROM Devices WHERE Id = ?").run(id);
    }

    editName(name, id) {
        this.db.prepare("UPDATE Devices SET Name = ? WHERE Id = ?").run(name, id);
    }

    updateLastOnline(id) {
        let date = new Date();
        this.db.prepare("UPDATE Devices SET Date = ? WHERE Id = ?").run(date.toISOString().replace("T", " "), id);
    }

    edituserPlantId(UserPlantId, id) {
        console.log(UserPlantId, id)
        const res = this.db.prepare("UPDATE Devices SET UserPlantId = ? WHERE Id = ?").run(UserPlantId, id);
        console.log(res)
    }

    editDescription(description, id) {
        this.db.prepare("UPDATE Devices SET Description = ? WHERE Id = ?").run(description, id);
    }

    changeAccessKey(id, cb) {
        const newKey = uuid.v6()

        this.db.prepare("UPDATE Devices SET AccessKey = ? WHERE Id = ?").run(newKey, id);

        return cb(null, newKey)

    }

    getDeviceById(id, cb) {
        const rows = this.db.prepare("SELECT * FROM Devices WHERE Id = ?").all(id);
        if (rows.length > 0) {
            return cb(null, rows[0]);
        } else {
            return cb(null, null)
        }
    }

    getDeviceByKey(key, cb) {
        const rows = this.db.prepare("SELECT * FROM Devices WHERE AccessKey = ?").all(key);
        if (rows.length > 0) {
            return cb(null, rows[0]);
        } else {
            return cb(null, null)
        }
    }

    getDeviceByPlantId(plantId, cb) {
        const rows = this.db.prepare("SELECT * FROM Devices WHERE UserPlantId = ?").all(plantId);
        if (rows.length > 0) {
            return cb(null, rows[0]);
        } else {
            return cb(null, false)
        }
    }

    getDevices(userId, cb) {
        const rows = this.db.prepare("SELECT * FROM Devices WHERE UserId = ?").all(userId);
        if (rows.length > 0) {
            return cb(null, rows);
        } else {
            return cb(null, null)
        }
    }

    getOfflineDevices(cb) {
        let date = new Date()
        date.setMinutes(date.getMinutes()-15)
        const rows = this.db.prepare("SELECT Id, UserPlantId, Date FROM Devices WHERE UserPlantId IS NOT NULL AND (Date < datetime('now', '-15 MINUTES') OR Date IS NULL)").all();
        if (rows.length > 0) {
            return cb(null, rows);
        } else {
            return cb(null, null)
        }
    }

    getOnlineDevices(cb) {
        const rows = this.db.prepare("SELECT Id, UserPlantId, Date FROM Devices WHERE UserPlantId IS NOT NULL AND Date > datetime('now', '-15 MINUTES')").all();
        if (rows.length > 0) {
            return cb(null, rows);
        } else {
            return cb(null, null)
        }
    }

    getUnAssignedDevices(userId, cb) {
        const rows = this.db.prepare("SELECT * FROM Devices WHERE UserId = ? AND UserPlantId IS NULL").all(userId);
        if (rows.length > 0) {
            return cb(null, rows);
        } else {
            return cb(null, null)
        }
    }
}

const model = new DeviceModel;
model.init();

module.exports = model