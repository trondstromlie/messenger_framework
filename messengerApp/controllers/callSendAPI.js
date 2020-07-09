"use strict";
//send message function
//construct the message body

const request = require("request");
const config = require("config");
const logMessage = require("./writeToLog");

module.exports = async function callSendAPI (sender_psid, response, m_type) {

  //send responce to the console.log;
  try {

  let log = await logMessage(sender_psid, response.text, "The Robot");
  let messaging_type = "MESSAGE_TAG";
   if (m_type) messaging_type = m_type;

} catch(e) {
  console.error(e);
}


  // Construct the message body
  const request_body = {
    "recipient": {
      "id": sender_psid
    },
    "messaging_type": m_type
   }

//add data to the request_body

if(response.text) request_body.message = response.text;
if(response.payload) request_body.payload = response.payload;



   // Send the HTTP request to the Messenger Platform
  

  return new Promise( ( resolve , reject ) => { 

    request({
      "uri": "https://graph.facebook.com/v2.6/me/messages",
      "qs": { "access_token": config.get('FbPageToken') },
      "method": "POST",
      "json": request_body
     }, (err, res, body) => {
      if (!err) {
       console.log({msg:'message sent!' , body})
       resolve(body)
      } else {
         console.error("Unable to send message:" + err);
         reject(err);
      }
    });
  } );

 }
