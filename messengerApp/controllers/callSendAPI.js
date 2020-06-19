"use strict";
//send message function
//construct the message body

const request = require("request");
const config = require("config");
const logMessage = require("./writeToLog");

module.exports = async function callSendAPI (sender_psid, response) {

  //send responce to the console.log;
  try {

  let log = await logMessage(sender_psid, response.text, "The Robot");
  console.log(log)

} catch(e) {
  console.error(e);
}


  // Construct the message body
  const request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
   }
   // Send the HTTP request to the Messenger Platform

  request({
   "uri": "https://graph.facebook.com/v2.6/me/messages",
   "qs": { "access_token": config.get('FbPageToken') },
   "method": "POST",
   "json": request_body
  }, (err, res, body) => {
   if (!err) {
    return console.log('message sent!')
   } else {
     return console.error("Unable to send message:" + err);
   }
 });
 }
