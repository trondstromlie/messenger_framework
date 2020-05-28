//sendQuickReplies
const request = require('request');
const sendMessage = require('./sendMessage');
const senderAction = require('./senderAction');
module.exports = function sendQuickReplies(recipientId, respBody,user_fields) {

  sendMessage(recipientId, {text: "programmet starter "}).then( () => {
    senderAction(recipientId);


  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
      method: 'POST',
      json: {
        recipient:{"id":recipientId},
        messaging_type: "RESPONSE",
        message:{
          text: "ok " +user_fields.first_name+ " velg med knapen under alternativet som passer deg best:",
          quick_replies:[
            {
            content_type:"text",
            title:"velg denne",
            payload:"alt1"
            },
            {
            content_type:"text",
            title:"eller denne",
            payload:"alt2"
          }
        ]
      }
    }
  },

   function(error, response, body){
        console.log(response);
        if (error) {
          console.log("Error sending message: " + response.error)
         }
    }

  );
});
}
