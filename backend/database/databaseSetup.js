const db = require('better-sqlite3')('./database.db');
const {readFile} = require("fs");

const query = `
CREATE TABLE Users(
    Id INT PRIMARY KEY,
    Firstname TEXT,
    Email TEXT,
    Password TEXT
);

CREATE TABLE Plant_Info(
    Id INT PRIMARY KEY,
    CommonName TEXT,
    ScientificName TEXT,
    Description TEXT,
    MinPh FLOAT,
    MaxPh FLOAT,
    MinTemp FLOAT,
    WateringPeriod INT
);
CREATE TABLE User_Plants(
    Id INT PRIMARY KEY,
    UserId INT,
    PlantInfoId INT,
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (PlantInfoId) REFERENCES Plant_Info(Id)
);
CREATE TABLE Data(
    Id INT PRIMARY KEY,
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
    Id INT PRIMARY KEY,
    UserPlantId INT,
    TypeId INT,
    SeverityId FLOAT,
    Date DATETIME,
    Sent BOOLEAN,
    FOREIGN KEY (UserPlantId) REFERENCES User_Plants(Id),
    FOREIGN KEY (TypeId) REFERENCES Type(Id),
    FOREIGN KEY (SeverityId) REFERENCES Severity(Id)
);
CREATE TABLE Devices(
    Id INT PRIMARY KEY,
    UserPlantId INT,
    LastOnline DATETIME,
    FOREIGN KEY (UserPlantId) REFERENCES User_Plants(Id)
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
        db.prepare(`INSERT INTO Plant_Info (CommonName, MinPh, MaxPh, MinTemp, WateringPeriod) VALUES (?,?,?,?,?)`).run([r[0],r[1],r[2],r[3],r[4]])
    })
})