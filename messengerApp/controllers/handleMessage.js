
const callSendAPI = require('./callSendAPI');
const fetchUserData = require('./fetchUserData');
const logMessage = require('./writeToLog');
const addandupdate_userfields = require('./addandupdate_userfields');



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
  //fetch the user data from api

  let userFields = await fetchUserData(sender_psid);

  //write message to the users log
  logMessage( sender_psid , received_message , userFields.user.first_name);

try {
    if(received_message.text === "Init") {


      let user_process = "get_personal";

      await addandupdate_userfields.add_user_process(sender_psid,user_process , userFields.user );

      let responce = {text:"Hei " + userFields.user.name + " Du er nå registrert i prosessen " + user_process};

      await callSendAPI( sender_psid , responce )
    }
    else {
      let responce = {text:`Hei ${userFields.user.first_name}, jeg vet ikke hva jeg skal gjøre med denne meldingen. Skriv Init for å starte programmet `};

      await callSendAPI(sender_psid, responce);
    }



}catch(e) {

  console.error(e.message);
}
};

}
