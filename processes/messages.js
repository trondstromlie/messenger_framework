const request = require('request');
const senderAction = require('../templates/senderAction');
const sendMessage = require('../templates/sendMessage');
const sendGenericTemplate = require('../templates/sendGenericTemplate');
module.exports = function processMessage(event) {

  const id_fields = request({ url: "https://graph.facebook.com/v2.6/" + event.sender.id,
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN,
          fields: "first_name,last_name,email"

        },
        method: "GET"
      }, (error,res,body) =>{
        let fields = JSON.parse(body);
        console.log(fields);
        return fields;
      });



    if (!event.message.is_echo) {
      const message = event.message;
      const senderID = event.sender.id;
      console.log(event.sender);
      console.log("Received message from senderId: " + senderID);
      console.log("Message is: " + JSON.stringify(message));
    if (message.text) {
      senderAction(senderID);
       sendMessage(senderID, {text: "hei på deg " fields.first_name}).then(() => {
          senderAction(senderID);
         sendMessage(senderID, { text: "veldig koselig"}).then(() => {
            senderAction(senderID);
           sendMessage(senderID, {  text: "hyggelig å se deg "}).then(() => {
             senderAction(senderID);
             sendMessage(senderID, { text: '🎈' });
         })
      });
    });


       const body = {"message":"du sa ","msg": message.text}
       sendGenericTemplate(senderID,body);
      };
    }
  }
