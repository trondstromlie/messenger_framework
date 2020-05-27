const request = require('request');
module.exports = function sendGenericTemplate(recipientId, respBody) {
   console.log(respBody);
   message[{"title":"hei på deg","subtitle":"fint å se deg"},{"title":"bra bra","subtitle":"velfig bra bra"}];
         let messageData = {
         "attachment": {
         "type": "template",
         "payload": {
               "template_type": "generic",
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
 
