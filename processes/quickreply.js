const request = require('request');
const senderAction = require('../templates/senderAction');
const sendMessage = require('../templates/sendMessage');
const sendGenericTemplate = require('../templates/sendGenericTemplate');
const quickReplies = require('../templates/quickReplies');

module.exports = async function quickreply(event) {

    console.log("starter quick_reply");
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
      const quickreply = JSON.stringify(event.message.quick_reply.payload)
      console.log(event.sender);
      console.log("Received message from senderId: " + senderID);
      console.log("Message is: " + JSON.stringify(message));

    //du kan se i postback filen hvordan han finner ut a payload er welcome
    //quickreply gir payload texten
    console.log(quickreply);
    if (message.quickreply) {

      senderAction(senderID);
       sendMessage(senderID, {text: "payload registrert "+ user_fields.first_name}).then(() => {

             sendMessage(senderID, { text: '🎈' });
           });

  }

     }
   });
  }
