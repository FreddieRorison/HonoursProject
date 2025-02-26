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

    getPlantFromId(id, cb) {
        const rows = this.db.prepare("SELECT * FROM User_Plants WHERE Id = ?").all(id);
        if (rows.length > 0) {
            return cb(null, rows[0]);
        } else {
            return cb(null, null)
        }
    }

    getPlants(userId) {
        const rows = this.db.prepare("SELECT * FROM User_Plants WHERE UserId = ?").all(userId);
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

    editName(id, Name) {
        this.db.prepare("UPDATE User_Plants SET Name = ? WHERE Id = ?").run(Name, id);
    }

    editPlantInfoId(id, PlantType) {
        this.db.prepare("UPDATE User_plants SET PlantInfoId = ? WHERE Id = ?").run(PlantType, id);
    }

    editMoisture(id, moisture) {
        const result = this.db.prepare("UPDATE User_plants SET Moisture = ? WHERE Id = ?").run(moisture, id);
    }

    editTemperature(id, temperature) {
        this.db.prepare("UPDATE User_plants SET Temperature = ? WHERE Id = ?").run(temperature, id);
    }

    editPh(id, ph) {
        this.db.prepare("UPDATE User_plants SET Ph = ? WHERE Id = ?").run(ph, id);
    }

}

const model = new PlantModel;
model.init();

module.exports = model;