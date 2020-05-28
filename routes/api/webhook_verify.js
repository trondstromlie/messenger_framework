const processPostback = require('../../processes/postback');
const processMessage = require('../../processes/messages');
const processQuickreply = require('../../processes/quickreply');
const express = require('express');
const router = express.Router();
const url = require('url');
const http = require('http');


  router.get('/' , (req,res) => {
    const queryObject = url.parse(req.url,true).query;
    console.log(queryObject);
    res.send("@ GET /  verify " + queryObject["id"]);
  });


  router.get('/hook', function(req, res) {
    const queryObject = url.parse(req.url,true).query;
    console.log(process.env.VERIFY_TOKEN);
    console.log(queryObject)
    if (queryObject["hub.verify_token"] === process.env.VERIFY_TOKEN){ //
       console.log('webhook verified');
       res.status(200).send(queryObject["hub.challenge"]);
    } else {
        console.error('verification failed. Token mismatch.');
        res.sendStatus(403);
     }
  });

  router.post('/hook', function(req, res) {
    //checking for page subscription.
    if (req.body.object === 'page'){



       /* Iterate over each entry, there can be multiple entries
       if callbacks are batched. */
       req.body.entry.forEach(function(entry) {
       // Iterate over each messaging event
          entry.messaging.forEach(function(event) {
          console.log(event);
          if (event.postback){
             processPostback(event);
          } else if (event.message){
             processMessage(event);
          } else if (event.quick_reply) {
             processQuickreply(event);
          }
      });
    });
    res.sendStatus(200);
   }
  });

module.exports = router;
