"use strict";

const callSendAPI = require('./callSendAPI');
const fetchUserData = require('./fetchUserData');
const logMessage = require('./writeToLog');
const process_loop = require('./process_loop')
const senderAction = require('./senderAction');
const addandupdate_userfields = require('./addandupdate_userfields');



module.exports = async function handleReferral (sender_psid, received_message) {

    user = fetchUserData(sender_psid);

    console.log("************ starting handle refferal   ************ ");
    console.log(received_message);
    
  if ( received_message.ref ) {
        console.log("referal discovered");
        console.log({received_message :received_message.ref});

        let ref_obj = [
            {process_key: "Pizza", process_name : "Pizza" }
        ];

        let check_obj = ref_obj.filter(item => item.process_key.toLowerCase() === received_message.ref.toLowerCase());
        
        if(check_obj.length > 0 ) {

            let add_user_process =  await addandupdate_userfields.add_user_process(sender_psid, payload.messenger_process , user);
        
            await process_loop(check_obj[0].process_name, add_user_process, 0 , received_message);
    
            return NaN;

        } else {

            console.log("error no messenger process found matching this ref");

            return NaN;
        }
    
  }
};