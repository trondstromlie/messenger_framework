//sendQuickReplies
const request = require('request');
module.exports = function sendQuickReplies(recipientId, respBody) {


   const message = [{"title":"hei på deg","subtitle":respBody["msg"]}];

         let messageData = {"attachment":
          {"type": "RESPONSE",
           "message":{ "text": "Pick a color:",

           "quick_replies":[ {
               "content_type":"text",
               "title":"Red",
                "payload":"hurra",}
              ]}
            }}

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


   )

 }
