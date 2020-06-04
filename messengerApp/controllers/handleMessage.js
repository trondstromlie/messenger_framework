"use strict";
const callSendAPI = require("./callSendAPI");
const getUserData = require("./getUserData");


//handle message
//function

module.exports = async function handleMessage (sender_psid, received_message) {

  //console.log(JSON.stringify(received_message));


  //check if messege contain the word "hei"
  try {

    if(received_message.text === "Hei") {

      let userdata = await getUserData(sender_psid);

      console.log(userdata.first_name);

      let response = {"text":"hello " +userdata['first_name']+ " du skriver med roboten nå"};

      await callSendAPI(sender_psid,response);

      return null;

    }

  } catch(e) {
    console.error(e.message);
  }



  };
