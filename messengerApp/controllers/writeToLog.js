"use strict"

const request = require("request");


function writeToLog(sender_psid, message , first_name) {



    let options = {
      url:"https://phonestats.herokuapp.com/api/messenger/messenger_log",
      method:"PUT",
      json:{sender_psid:sender_psid,message:message,first_name:first_name}
    };

    //create the rpomise
    return new Promise ( ( resolve, reject ) => {
    //do the async stuff here

    request(options, ( err, response, body ) => {
       if(err) {
         reject(err);
       } else {
         resolve(body);
       }
    });
  });//end Promise

}

module.exports = writeToLog;
