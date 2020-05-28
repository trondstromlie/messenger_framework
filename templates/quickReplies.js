//sendQuickReplies
const request = require('request');
const sendMessage = require('./sendMessage');
module.exports = function sendQuickReplies(recipientId, respBody) {

  sendMessage(recipientId, {text: "programmet starter "});


  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
      method: 'POST',
      json: {
        recipient:{"id":recipientId},
        messaging_type: "RESPONSE",
        message:{
          text: "her får du to valg, velg den som passer deg best:",
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
      }
   },
   function(error, response, body){
        console.log(response);
        if (error) {
          console.log("Error sending message: " + response.error)
         }
    }

  );
}
