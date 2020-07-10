"use strict";
const callSendAPI = require('./callSendAPI');
const { response } = require('express');


module.exports = async function handleRefferal (sender_psid, refferal) {

    console.log(refferal.ref);
    let response = {text:"Ok det er notert"};

    await callSendAPI(sender_psid, response);
    return NaN;
};