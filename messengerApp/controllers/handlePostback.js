"use strict";

const callSendAPI = require('./callSendAPI');
const fetchUserData = require('./fetchUserData');
const logMessage = require('./writeToLog');
const process_loop = require('./process_loop')
const senderAction = require('./senderAction');


module.exports = async function handlePostBack(sender_psid , received_message) {

    console.log(received_message);
    let payload = JSON.parse(received_message.payload)
    const user = await fetchUserData(sender_psid);

    await senderAction(sender_psid , 'mark_seen');
    
    
    if( payload.messenger_process === user.user.messenger_processes[0].process_name ) {

        //send the controll back to the function with the payload 

        await process_loop(received_message.payload.messenger_process, user.user, 0 , received_message);

        //create "the listen for payload" function in the process loop to store a object in a custom field...

    } else {
        
        console.log("new process starting pausing or deleting all processes");

    };
    
    //the logic for the postback starts here 


    //if received_message.name === in user.messenger_processes 



    //first i want the postback menu clicks to be able to breake off any messenger prosess, not like in handle message.
    //where we first check for a process than check for recievd message.
    //f.eks if someone click unsubscribe this kills the existing process.

    // creata a postback starter object, with the active postback fracez we are waiting for
    // in this case the payload is an object with a key name and value function this shoud be the process name 
    // same with unsubscribe should be a new process name 

   



};