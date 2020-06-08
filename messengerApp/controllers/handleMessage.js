
const callSendAPI = require("./callSendAPI");
const fetchUserData = require("./fetchUserData");


//handle message
//function

module.exports = async function handleMessage (sender_psid, received_message) {

if(received_message.is_echo == true) {

console.log({"is_echo:":received_message.text});

}



  //check if messege contain the word "hei"
else if(received_message.text === "Hei") {
  console.log({"received_message:":received_message.text});
  try {

      let userdata = await fetchUserData(sender_psid);
      console.log({"fetchUserData":userdata});

      console.log(userdata.user.first_name);

      let response = {"text":"hello " +userdata['user']['first_name']+ " du skriver med roboten nå"};

      await callSendAPI(sender_psid , response);

      return null;



  } catch(e) {
    console.error(e.message);
  }
  //end
 //check if name is trond contain the word "and message contain word init"
 }  else if(received_message.text === "start") {

  try {

      let userdata = await fetchUserData(sender_psid);

      if (userdata.user.first_name === "Kristina") {
        let response = {"text":"hei  " + userdata['user']['first_name'] + " Jeg er ekstra nyforelska i deg i dag <3"};
        await callSendAPI(sender_psid , response);
        return null;

      } else if (userdata.user.first_name === "Trond") {
         let response = {"text":"hello " +userdata['user']['first_name']+ " du heter ikke kristina vell?"};

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

      let userdata = await fetchUserData(sender_psid);

        let response = {"text":"hei <3 "+ userdata.first_name +" du skrev " + received_message.text};
        await callSendAPI(sender_psid , response);


  } catch(e) {
    console.error(e.message);
  };
  //end

  }
};
