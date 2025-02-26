const db = require('better-sqlite3')('../database/database.db');

class DeviceModel {
    init() {
        this.db = db
    }

}

const model = new DeviceModel;
model.init();

module.exports = model