"use strict";
const callSendAPI = require("./callSendAPI");
const getUserData = require("./getUserData");


//handle message
//function

module.exports = async function handleMessage (sender_psid, received_message) {

if(received_message.is_echo == true) {

console.log(JSON.stringify(received_message));

}



  //check if messege contain the word "hei"
else if(received_message.text === "Hei") {

  try {

      let userdata = await getUserData(sender_psid);

      console.log(userdata.first_name);

      let response = {"text":"hello " +userdata['first_name']+ " du skriver med roboten nå"};

      await callSendAPI(sender_psid , response);

      return null;



  } catch(e) {
    console.error(e.message);
  }
  //end
 //check if name is trond contain the word "and message contain word init"
 }  else if(received_message.text === "start") {

  try {

      let userdata = await getUserData(sender_psid);

      if (userdata.first_name === "Kristina") {
        let response = {"text":"hei  " + userdata['first_name'] + " Jeg er ekstra nyforelska i deg i dag <3"};
        await callSendAPI(sender_psid , response);
        return null;

      } else if (userdata.first_name === "Trond") {
         let response = {"text":"hello " +userdata['first_name']+ " du heter ikke kristina vell?"};

         await callSendAPI(sender_psid , response);

      return null;
      }
      else {
        let response = {"text":"Jeg kjenner ikke deg"};
        await callSendAPI(sender_psid , response);
        return 0
      }

  } catch(e) {
    console.error(e.message);
  }

  //end

}  else if(received_message.text) {

  try {

      let userdata = await getUserData(sender_psid);

        let response = {"text":"hei <3 "+ userdata.first_name +" du skrev " + received_message.text};
        await callSendAPI(sender_psid , response);


  } catch(e) {
    console.error(e.message);
  };
  //end

  }
};
