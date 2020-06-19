
const callSendAPI = require('./callSendAPI');
const fetchUserData = require('./fetchUserData');
const logMessage = require('./writeToLog');
const addandupdate_userfields = require('./addandupdate_userfields');
const process_loop = require('./process_loop')



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


if(!received_message.is_echo === true) {
  //fetch the user data from api

try {

  let userFields = await fetchUserData(sender_psid);

  //write message to the users log
  let log = await logMessage( sender_psid , received_message.text , userFields.user.first_name);



    //check if active proceceses
  let messenger_processes  = userFields.user.messenger_processes;

  let indexAndNameOfActiveUserprocess = []
  //find name and index of the active processes
  await messenger_processes.forEach((item, i) => {
    console.log(item)
    if (item.process_status === true) indexAndNameOfActiveUserprocess.push( {index : i , process_name : item.process_name});
    });
    console.log({indexAndNameOfActiveUserprocess:indexAndNameOfActiveUserprocess})

    if(indexAndNameOfActiveUserprocess[0].item >= 0) {
      console.log("found a user process " + indexAndNameOfActiveUserprocess[0].item + " contuing the user process");
      await process_loop(indexAndNameOfActiveUserprocess.item.process_name, userFields.user, indexAndNameOfActiveUserprocess.index, received_message);

    return NaN;



      //find index of current messenger_processes


    } //if text is === to something
    else if(received_message.text === "Init") {


      let user_process = "get_personal";


      let messenger_processes  = userFields.user.messenger_processes;

      let indexAndNameOfActiveUserprocess = []
      //find name and index of the active processes
      await messenger_processes.forEach((item, i) => {
        console.log(item)
        if (item.process_status === true) indexAndNameOfActiveUserprocess.push( {index : i , process_name : item.process_name});
      });

      if(indexAndNameOfActiveUserprocess > 0) {
        console.log("contuing the user process");
        await process_loop(indexAndNameOfActiveUserprocess.item.process_name, userFields.user, indexAndNameOfActiveUserprocess.index, received_message);
        return NaN;

      }else {

      }


      await addandupdate_userfields.add_user_process(sender_psid,user_process , userFields.user );

      let responce = {text:"Hei " + userFields.user.name + " Du er nå registrert i prosessen " + user_process};

      await callSendAPI( sender_psid , responce );

      await process_loop(userProcess, userFields.user, 0, received_message);

      return NaN;

    }
    else {


      let responce = {text:`Hei ${userFields.user.first_name}, jeg vet ikke hva jeg skal gjøre med denne meldingen. Skriv Init for å starte programmet `};

      await callSendAPI(sender_psid, responce);

      return NaN;
    }

}catch(e) {

  console.error(e.message);
}
};

}
