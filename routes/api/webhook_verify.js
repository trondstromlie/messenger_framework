const processPostback = require('../../processes/postback');
const processMessage = require('../../processes/messages');
const express = require('express');
const router = express.Router();


  router.get('/' , (req,res) => {
    res.send("@ GET /  verify ")
  });


  router.get('/hook', function(req, res) {
    console.log(process.env.VERYFY_TOKEN);
    console.log(req.query['hub.veryfy_token']);
    if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN){
       console.log('webhook verified');
       res.status(200).send(req.query['hub.challenge']);
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
          }
      });
    });
    res.sendStatus(200);
   }
  });

module.exports = router;
