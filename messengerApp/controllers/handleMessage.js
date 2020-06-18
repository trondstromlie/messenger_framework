
const callSendAPI = require("./callSendAPI");
const fetchUserData = require("./fetchUserData");
const logMessage = require("./writeToLog");



//  Add functions and api to update statuses for progress fields
//
// Add function and API to update the progress f.ex - wait for emailadress use regex to check emeil
// and send to api for adding fields to the user object
//
//  #1 make api to take name og prosess, wait for email, number og steps in prosess( check if email is registered in the main system prosess. )
//  #2 connect messenger message handler to api
//
//!!*******************************************************************




//handle message
//function

module.exports = async function handleMessage (sender_psid, received_message) {




if(!received_message.is_echo == true) {
  await logMessage(sender_psid, received_message.text, userdata.user.first_name);
  let userdata = await fetchUserData(sender_psid);
  console.log({userdata:userdata});
  let log = await logMessage(sender_psid, received_message.text, userdata.user.first_name);
}

if(received_message.is_echo == true) {

console.log({"is_echo:":received_message.text});


}  //check if messege contain the word "Hei"
else if(received_message.text === "Init") {

  console.log({"received_message:":received_message.text});

  try {

      //add the process get_personel to the user fields
      //is activ true

      let response = {"text":"hello " +userdata['user']['first_name']+ " du skriver med roboten nå"};

      await callSendAPI(sender_psid , response);


      return null;



  } catch(e) {
    console.error(e.message);
   }
  //end
 //check if name is trond contain the word "and message contain word init"
 }
  //end

}
