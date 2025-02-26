const db = require('better-sqlite3')('./database.db');
const {readFile} = require("fs");
const uuid = require('uuid');

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
    MinPh FLOAT,
    MaxPh FLOAT,
    MinTemp FLOAT,
    WateringPeriod INT
);
CREATE TABLE User_Plants(
    Id TEXT PRIMARY KEY,
    Name TEXT,
    UserId TEXT,
    PlantInfoId TEXT,
    DeviceId TEXT,
    Moisture BOOLEAN,
    Temperature BOOLEAN,
    Ph BOOLEAN,
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (PlantInfoId) REFERENCES Plant_Info(Id)
    FOREIGN KEY (DeviceId) REFERENCES Devices(Id)
);
CREATE TABLE Data(
    Id TEXT PRIMARY KEY,
    UserPlantId INT,
    Date DATETIME,
    Humidity INT,
    Ph FLOAT,
    Temp FLOAT,
    FOREIGN KEY (UserPlantId) REFERENCES User_Plants(Id)
);
CREATE TABLE Type(
    Id INT PRIMARY KEY,
    Name TEXT,
    Description TEXT
);
CREATE TABLE Severity(
    Id INT PRIMARY KEY,
    Name TEXT,
    Icon URL,
    Colour TEXT
);
CREATE TABLE Notification_History(
    Id TEXT PRIMARY KEY,
    UserPlantId INT,
    TypeId INT,
    SeverityId FLOAT,
    Date DATETIME,
    Sent BOOLEAN,
    Resolved BOOLEAN,
    FOREIGN KEY (UserPlantId) REFERENCES User_Plants(Id),
    FOREIGN KEY (TypeId) REFERENCES Type(Id),
    FOREIGN KEY (SeverityId) REFERENCES Severity(Id)
);
CREATE TABLE Devices(
    Id TEXT PRIMARY KEY,
    LastOnline DATETIME,
    Name TEXT,
    Description TEXT
);`

const queries = query.split(';');

queries.forEach(q => {
    if (q) {
        q += ';';
        db.prepare(q).run();
    }
})

readFile('./data/PlantInfo.csv', 'utf-8', (err, data) => {
    if (err) {console.error(err);return;}
    data.split('\n').forEach(function (row) {
        if (!row) {return;}
        var r = row.split(',');
        db.prepare(`INSERT INTO Plant_Info (Id, CommonName, MinPh, MaxPh, MinTemp, WateringPeriod) VALUES (?,?,?,?,?,?)`).run([uuid.v4(),r[0],r[1],r[2],r[3],r[4]])
    })
})