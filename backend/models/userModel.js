const bcrypt = require('bcrypt');
const salt = 10;
const db = require('better-sqlite3')('../database/database.db');

class userModel {
    init() {
        this.db = db
    }

    create(firstname, email, password) {
        const thi = this;
        bcrypt.hash(password, salt).then(function(hash) {
            thi.db.prepare("INSERT INTO (Firstname, Email, Password) VALUES (?,?,?)").run([firstname, email, hash])
        })
    }

    accountCheckExists() {
        
    }

    getAccountFromId() {

    }

    
}