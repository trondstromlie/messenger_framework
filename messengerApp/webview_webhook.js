"use strict";
const express = require('express');
const router = express.Router();
const config = require('config');
//const User = require("../models/User");
const handleMessage = require("./controllers/handleMessage");
const handlePostBack = require('./controllers/handlePostback');
const handleReferral = require('./controllers/handleReferral');

router.get("/", (req, res) => {
    res.send("GET @ messengerapp/webview_webhook");
});



module.exports = router;
