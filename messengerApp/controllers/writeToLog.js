"use strict"

const request = require("request");


function writeToLog(sender_psid, message , first_name) {



    let options = {
      url:"https://phonestats.herokuapp.com/api/messenger/messenger_log",
      method:"PUT",
      json:{sender_psid:sender_psid,message:message,first_name:first_name}
    };

    //create the rpomise
    return new Promise ( ( responce, reject ) => {
    //do the async stuff here

    request(options, ( err, result, body ) => {
       if(err) {
         reject(err);
       } else {
         responce(body);
       }
    });
  });//end Promise

}

module.exports = writeToLog;
