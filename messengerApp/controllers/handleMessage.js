
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

  let indexAndNameOfActiveUserprocess = [];
  //find name and index of the active processes
  await messenger_processes.forEach((item, i) => {

    if (item.process_status === true) indexAndNameOfActiveUserprocess.push( {index : i , process_name : item.process_name});
    });


    if(indexAndNameOfActiveUserprocess.length > 0) {
      console.log("found a user process " + indexAndNameOfActiveUserprocess[0].process_name + " contuing the user process");


      await process_loop(indexAndNameOfActiveUserprocess[0].process_name, userFields.user, indexAndNameOfActiveUserprocess[0].index, received_message);

      return NaN;

      //find index of current messenger_processes

    } //if text is === to something
    else if(received_message.text === "Init") {

      console.log("\n *********************** starting Iit *********************** \n")
      let messenger_processes  = userFields.user.messenger_processes;


      if(indexAndNameOfActiveUserprocess > 0) {
        console.log("contuing the user process");
        await process_loop(indexAndNameOfActiveUserprocess[0].process_name, userFields.user, indexAndNameOfActiveUserprocess[0].index, received_message);
        return NaN;

      }else {

        console.log("\n********************   creating new process ************************");
        let messenger_process = "get_personal";

        let add_user_process =  await addandupdate_userfields.add_user_process(sender_psid, messenger_process, user);

        //console.log(add_user_process);

        index = []
        await add_user_process.messenger_processes.forEach((item, i) => {
          if ( item.process_name === messenger_process  ) {
            index.push({process_name: item.process_name, index:i})
          }
        });

        if(!index > 0) {
          throw("index not found in register process");

        } else {


          let responce = {text:"Hei " + userFields.user.name + " Du er nå registrert i prosessen " + messenger_process};

          await callSendAPI( sender_psid , responce ,"RESPONCE");

          console.log(index[0].index)
          await process_loop(messenger_process, add_user_process, index[0].index , received_message);



          //add the procecc to the user with the api and start the process loop



          return NaN;
        }

      }

    }

    else if (received_message.text === "Hello") {

      console.log("\n********************   creating new process Hello ************************");

      let messenger_process = "confirm_start";

      let add_user_process =  await addandupdate_userfields.add_user_process(sender_psid, messenger_process, user);

      //console.log(add_user_process);

      index = [];

      await add_user_process.messenger_processes.forEach((item, i) => {
        if ( item.process_name === messenger_process  ) {
          index.push({process_name: item.process_name, index:i})
        }
      });

      if(!index.lenght > 0) {
        throw("index not found in register process");

      } else {


        let responce = {text:"Hei " + userFields.user.name + " Du er nå registrert i prosessen " + messenger_process};

        await callSendAPI( sender_psid , responce ,"RESPONCE");

        console.log(index[0].index)

        await process_loop(messenger_process, add_user_process, index[0].index , received_message);



        //add the process to the user with the api and start the process loop



        return NaN;
      }


    } //******ending hello process starter */

    else {

      console.log("\n ********************* starting else *******************\n ")

      let responce = {text:`Hei ${userFields.user.first_name}, jeg vet ikke hva jeg skal gjøre med denne meldingen. Skriv Init for å starte programmet `};

      await callSendAPI(sender_psid, responce , "RESPONSE");

      return NaN;
    }

}catch(e) {

  console.error(e.message);
}
};

}
