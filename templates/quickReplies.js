//sendQuickReplies
const request = require('request');
module.exports = function sendQuickReplies(recipientId, respBody) {


  const message =   {"message":{
      "text": "velg ditt svar:",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"Red",
          "payload":"svar2",
        },{
          "content_type":"text",
          "title":"Green",
          "payload":"svar1"

        }
      ]
    }};






        let messageData = {
        "attachment": {
        "type": "RESPONSE",
        "payload": {
              "elements": message
           }
        }
     }
  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
      method: 'POST',
      json: {
        recipient: {id: recipientId},
        message: messageData,
     }
   },
   function(error, response, body){
        if (error) {
          console.log("Error sending message: " + response.error)
         }
    }

  );
}
