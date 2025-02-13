const express = require('express');
const app = express();
const cors = require('cors')
require("dotenv").config();

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(cors())

app.use(express.json()) 
app.use(express.urlencoded({extended: true})) 

const router = require('./routes/router.js');
app.use("/", router);

app.listen(8080, () => {
    console.log("Listening for requests on 8080")
});