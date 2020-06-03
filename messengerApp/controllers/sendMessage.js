//send message function
//construct the message body
module.exports = function callSendAPI (sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
   }
   // Send the HTTP request to the Messenger Platform

  request({
   "uri": "https://graph.facebook.com/v2.6/me/messages",
   "qs": { "access_token": config.get('FbPageToken') },
   "method": "POST",
   "json": request_body
  }, (err, res, body) => {
   if (!err) {
    console.log('message sent!')
   } else {
     console.error("Unable to send message:" + err);
   }
 });
 }
