//sendQuickReplies
const request = require('request');
const sendMessage = require('./sendMessage');
const senderAction = require('./senderAction');
module.exports = function sendQuickReplies(recipientID , respBody , user) {



  sendMessage(recipientID, {text: "programmet starter "}).then( () => {

  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
      method: 'POST',
      json: {
        recipient:{"id":recipientID},
        messaging_type: "RESPONSE",
        message:{
          text: " ok "+user+" velg med knapene under, alternativet som passer deg best:",
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
        if (error) {
          console.log("Error sending message: " + response.error)
         }
    }

  );
});
}
