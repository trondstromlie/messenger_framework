const request = require('request');
const senderAction = require('../templates/senderAction');
const sendMessage = require('../templates/sendMessage');
const sendGenericTemplate = require('../templates/sendGenericTemplate');
const quickReplies = require('../templates/quickReplies');

module.exports = async function processMessage(event) {


    //use a get request to fetch name fields from graph
    await request({ url: "https://graph.facebook.com/v2.6/" + event.sender.id,
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN,
          fields: "first_name,last_name"

        },
        method: "GET"
      },  ( error,res,body ) => {
          let user_fields = JSON.parse(body);



    if (!event.message.is_echo) {
      const message = event.message;
      const senderID = event.sender.id;
      console.log(event.sender);
      console.log("Received message from senderId: " + senderID);
      console.log("Message is: " + JSON.stringify(message));
    if (message.text && message.text === "hei") {

      senderAction(senderID);
       sendMessage(senderID, {text: "hei på deg "+ user_fields.first_name}).then(() => {

             sendMessage(senderID, { text: '🎈' });

    });

  } else if(message.text === "start"){
      const body = {"message":"hei " +user_fields.first_name+ " du sa ","msg": message.text}
      QuickReplies(senderID,body);
  } else if(message.text){
      const body = {"message":"hei " +user_fields.first_name+ " du sa ","msg": message.text}
      sendGenericTemplate(senderID,body);

  }



     }
   });
  }
