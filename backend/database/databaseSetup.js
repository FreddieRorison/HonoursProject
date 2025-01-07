const db = require('better-sqlite3')('./database.db');

const query = `
CREATE TABLE Users(
    Id INT PRIMARY KEY,
    Firstname TEXT,
    Email TEXT,
    Password TEXT
);
CREATE TABLE Watering_Frequency(
    Id INT PRIMARY KEY,
    Name TEXT,
    Period Int
);
CREATE TABLE Plant_Info(
    Id INT PRIMARY KEY,
    CommonName TEXT,
    ScientificName TEXT,
    Description TEXT,
    MinTemp FLOAT,
    MaxTemp FLOAT,
    Ph FLOAT,
    WateringFrequency INT,
    FOREIGN KEY (WateringFrequency) REFERENCES Watering_Frequency(Id)
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