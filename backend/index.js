const express = require('express');
const app = express();
const cron = require('node-cron');
const cors = require('cors')
require("dotenv").config();

const deviceController = require('./controller/deviceController.js');

const plantModel = require("./models/plantModel.js");
//plantModel.removeAllData() // DELETES ALL DATA DISABLE BEFORE USE TESTING ONLY

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(cors())

app.use(express.json()) 
app.use(express.urlencoded({extended: true})) 

const router = require('./routes/router.js');
app.use("/", router);

deviceController.AnalysisEntryPoint()
cron.schedule("*/10 * * * *", async () => {
    await deviceController.AnalysisEntryPoint()
})

app.listen(8080, () => {
    console.log("Listening for requests on 8080")
});