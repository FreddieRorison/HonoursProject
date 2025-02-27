const db = require('better-sqlite3')('./database.db');
const {readFile} = require("fs");

const query = `
CREATE TABLE Users(
    Id TEXT PRIMARY KEY,
    Firstname TEXT,
    Email TEXT,
    Password TEXT
);

CREATE TABLE Plant_Info(
    Id TEXT PRIMARY KEY,
    CommonName TEXT,
    ScientificName TEXT,
    Description TEXT,
    MinPh FLOAT NOT NULL,
    MaxPh FLOAT NOT NULL,
    MinTemp FLOAT NOT NULL,
    WateringPeriod INT NOT NULL
);
CREATE TABLE User_Plants(
    Id TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    UserId TEXT NOT NULL,
    PlantInfoId TEXT NOT NULL,
    Moisture BOOLEAN,
    Temperature BOOLEAN,
    Ph BOOLEAN,
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (PlantInfoId) REFERENCES Plant_Info(Id)
);
CREATE TABLE Data(
    Id TEXT PRIMARY KEY,
    UserPlantId INT NOT NULL,
    Date DATETIME NOT NULL,
    Humidity INT,
    Ph FLOAT,
    Temp FLOAT,
    FOREIGN KEY (UserPlantId) REFERENCES User_Plants(Id)
);
CREATE TABLE Type(
    Id INT PRIMARY KEY,
    Name TEXT NOT NULL,
    Description TEXT NOT NULL
);
CREATE TABLE Severity(
    Id INT PRIMARY KEY,
    Name TEXT NOT NULL,
    Colour TEXT NOT NULL
);
CREATE TABLE Notification_History(
    Id TEXT PRIMARY KEY,
    UserPlantId INT NOT NULL,
    TypeId INT NOT NULL,
    SeverityId FLOAT NOT NULL,
    Date DATETIME NOT NULL,
    Sent BOOLEAN NOT NULL,
    Resolved BOOLEAN NOT NULL,
    FOREIGN KEY (UserPlantId) REFERENCES User_Plants(Id),
    FOREIGN KEY (TypeId) REFERENCES Type(Id),
    FOREIGN KEY (SeverityId) REFERENCES Severity(Id)
);
CREATE TABLE Devices(
    Id TEXT PRIMARY KEY,
    UserId TEXT NOT NULL,
    UserPlantId TEXT UNIQUE,
    AccessKey TEXT NOT NULL UNIQUE,
    Name TEXT NOT NULL,
    Description TEXT,
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (UserPlantId) REFERENCES User_Plants(Id)
);`

const queries = query.split(';');

queries.forEach(q => {
    if (q) {
        q += ';';
        db.prepare(q).run();
    }
})

readFile('./database/data/PlantInfo.csv', 'utf-8', (err, data) => {
    if (err) {console.error(err);return;}
    data.split('\n').forEach(function (row) {
        if (!row) {return;}
        var r = row.split(',');
        db.prepare(`INSERT INTO Plant_Info (Id, CommonName, MinPh, MaxPh, MinTemp, WateringPeriod) VALUES (?,?,?,?,?,?)`).run([r[0],r[1],r[2],r[3],r[4],r[5]])
    })
})