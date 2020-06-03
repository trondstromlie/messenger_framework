"use strict";
const callSendAPI = require("./callSendAPI");
const getUserData = require("./getUserData");


//handle message
//function

module.exports = async function handleMessage (sender_psid, received_message) {

  console.log(JSON.stringify(received_message));

  let response;
  let userdata = await getUserData(sender_psid)

  console.log({"user_data" : userdata});

  // Check if the message contains text
  if (received_message.text === "Image") {

    // Create the payload for a basic text message
    response = {
      "text": `You sent the message: "${received_message.text}". Now send me an image!`
    }
    // Sends the response message
    callSendAPI(sender_psid, response);

  } else if ( received_message.text === "Start") {
      console.log("start is active");
      // Sends the response message
      callSendAPI(sender_psid, response);
  } else if (received_message.text) {
      //send the responce message
      callSendAPI(sender_psid, {"text":"<3 :)"});
  }


}
