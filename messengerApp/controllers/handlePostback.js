"use strict";
const callSendAPI = require('./callSendAPI');


module.exports = async function handlePostBack(sender_psid , received_message) {

    console.log(received_message);
    await callSendAPI(sender_psid,{text:"postback received"});


};