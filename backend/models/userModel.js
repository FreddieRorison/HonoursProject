const bcrypt = require('bcrypt');
const uuid = require('uuid');
const db = require('better-sqlite3')('./database/database.db');


const salt = 10;

class userModel {
    init() {
        this.db = db
    }

    create(firstname, email, password) {
        const thi = this;
        bcrypt.hash(password, salt).then(function(hash) {
            thi.db.prepare("INSERT INTO Users (id, Firstname, Email, Password) VALUES (?,?,?,?)").run([uuid.v4(),firstname, email, hash])
        })
    }

    getfromEmail(email, cb) {
        const rows = this.db.prepare(`SELECT * FROM Users WHERE Email = '${email}'`).all()
        if (rows.length > 0) {
            return cb(null, rows[0]);
        } else {
            return cb(null, null)
        }
    }

    getfromId(id, cb) {
        const rows = this.db.prepare("SELECT * FROM Users WHERE Users.Id = ?").all([id]);
        if (rows.length > 0) {
            return cb(null, rows[0]);
        } else {
            return cb(true, null)
        }
    }
}

const model = new userModel;
model.init();

module.exports = model;