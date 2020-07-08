
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

// #3 add a starter function that reads available process loops, and starter keywords loops true a object
//  to make it easier to add and remove starter procecces. 
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

    } //end find and start process....
     

    //build a object with all keys and processes
   
    //if text is === to something
    else if (received_message.text === "Hello") {

      console.log("\n********************   creating new process Hello ************************");

      let messenger_process = "confirm_start";

      let add_user_process =  await addandupdate_userfields.add_user_process(sender_psid, messenger_process, user);
      

      //console.log(add_user_process);

      index = [];

      await add_user_process.messenger_processes.forEach((item, i) => {
        if ( item.process_name === messenger_process  ) {
          console.log("found one " + item.process_name + " is matching  " + messenger_process );
          index.push({process_name: item.process_name, index:i})
        }
      });
      console.log({index_value:index});
      if(!index.length > 0) {

        console.log("index not found in register process");
        console.log(add_user_process);

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


      //if no user procecc is active check if the string matches a starter fraze 
      console.log("looking for processes that match string  in process objeckt")

      //check if any of the procecc_keys match with the incoming text 
      const start_processes = {processes: [
        {process_key: "Add", process_name:"Add_customfield"},
        {process_key: "Init", process_name: "get_personal"}
      ]
          
      }; 
      let check = start_processes.processes.filter(item => item.process_key.toLowerCase() === received_message.text.toLowerCase());

      if(check.length > 0 ) {

        let add_user_process =  await addandupdate_userfields.add_user_process(sender_psid, check[0].process_name , user);
        await process_loop(check[0].process_name, add_user_process, 0 , received_message);
        return NaN;

       } else {

        
      console.log("\n ********************* starting else *******************\n ");


      let responce = {text:`Hei ${userFields.user.first_name}, jeg vet ikke hva jeg skal gjøre med denne meldingen. Skriv Init for å starte programmet `};

      await callSendAPI(sender_psid, responce , "RESPONSE");

      return NaN;

       }
    }

}catch(e) {

  console.error(e.message);
 }

};

}
