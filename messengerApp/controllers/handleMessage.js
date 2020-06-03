"use strict";
const callSendAPI = require("./callSendAPI");
const getUserData = require("./getUserData");


//handle message
//function

module.exports = async function handleMessage (sender_psid, received_message) {

  //console.log(JSON.stringify(received_message));



  // Check if the message contains text
  if (received_message.text === "Image") {

    let response;
    let userdata = await getUserData(sender_psid)

    console.log({"user_data" : userdata});

    // Create the payload for a basic text message
    response = {
      "text": `You sent the message: "${userdata.first_name +received_message.text}". Now send me an image!`
    }
    // Sends the response message
    return callSendAPI(sender_psid, response);


  } else if ( received_message.text === "Start") {

    let response;
    let userdata = await getUserData(sender_psid)

    console.log({"user_data" : userdata});
    console.log("start is active");

      // Sends the response message
      return callSendAPI(sender_psid, response);

  } else if (received_message.text) {
    try {
      let response;
      const userdata = await getUserData(sender_psid):

      console.log({"userdata else" : userdata});
        //send the responce message
        if (userdata.first_name === "Trond") {

        //create payload for messages
        response = {"text": `hei ${userdata.first_name} <3 :) du er flink`};
        console.log(response);

        return callSendAPI(sender_psid, response);

      } else {
        response = {"text":"hallo " + userdata.first_name}
        return callSendAPI(sender_psid, response );
      }
    } catch(e) {
       console.error(e.message);
     }

}

  };
