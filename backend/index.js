const express = require('express');
const app = express();
require("dotenv").config();

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json()) 
app.use(express.urlencoded({extended: true})) 

const router = require('./routes/router.js');
app.use("/", router);

app.listen(8080, () => {
    console.log("Listening for requests on 8080")
});