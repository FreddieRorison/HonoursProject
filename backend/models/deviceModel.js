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

    editName(name) {
        this.db.prepare("UPDATE Devices SET Name = ? WHERE Id = ?").run(name, id);
    }

    editDescription(description) {
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

    getDevices(userId) {
        const rows = this.db.prepare("SELECT * FROM Devices WHERE UserId = ?").all(userId);
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