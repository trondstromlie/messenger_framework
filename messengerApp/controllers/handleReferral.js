"use strict";
const callSendAPI = require('./callSendAPI');



module.exports = async function handleReferral (sender_psid, refferal) {
    console.log("************ starting handle refferal   ************ ");
    console.log(refferal.ref);
    let response = {text:"Ok det er notert"};

    await callSendAPI(sender_psid, response);
    return NaN;
    
};