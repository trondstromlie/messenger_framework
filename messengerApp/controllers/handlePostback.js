"use strict";

const callSendAPI = require('./callSendAPI');
const fetchUserData = require('./fetchUserData');
const logMessage = require('./writeToLog');
const process_loop = require('./process_loop')
const senderAction = require('./senderAction');
const addandupdate_userfields = require('./addandupdate_userfields');


module.exports = async function handlePostBack(sender_psid , received_message) {

    console.log(received_message);

    let payload = JSON.parse(received_message.payload);

    console.log({postback_payload:payload});

    const user = await fetchUserData(sender_psid);

    await senderAction(sender_psid , 'mark_seen');

    if ( received_message.refferal) {
        console.log("referal discovered");
        console.log({recieved_message :received_message.refferal});
        return NaN;

    }
    
    else if(user.user.messenger_processes.length === 0) {
        //no actice process is discovered
        //create start a new process 
        console.log("messenger process is empty jumping to next step");
        let add_user_process =  await addandupdate_userfields.add_user_process(sender_psid, payload.messenger_process , user);
        
        await process_loop(payload.messenger_process, add_user_process, 0 , received_message);
        return NaN;
                
    }
    
    else if( payload.messenger_process === user.user.messenger_processes[0].process_name ) {

        //an active process that match the ongoing process is discovered send the controll back to the function with the payload 

        await process_loop(payload.messenger_process, user.user, 0 , received_message);
        return NaN;

        //create "the listen for payload" function in the process loop to store a object in a custom field...

    } else {
        //an active process thet is not the same as this postback is discovered deleting og pausing the existing process.
        console.log("new process starting pausing or deleting all processes");
        return NaN;

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