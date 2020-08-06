"use strict";
const express = require('express');
const router = express.Router();
const config = require('config');
//const User = require("../models/User");
const handleMessage = require("./controllers/handleMessage");
const handlePostBack = require('./controllers/handlePostback');
const handleReferral = require('./controllers/handleReferral');


  // @ route GET / messengerapp / webhook
  // @ Adds support for GET requests to our webhook
router.get("/", ( req , res ) => {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = config.get("FBVERYFY_TOKEN");

    // Parse the query params

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {

        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);

      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    } else {
      res.status(501).send("server error");
    }

  });


  // @ route POST / messengerapp / webhook
  // @ Creates the endpoint for our webhook
router.post("/", ( req , res ) => {


  let body = req.body;

  console.log("\n***************** webhook_event  ******************");
      console.log(JSON.stringify(body,null,4));

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;

      console.log("\n***************** webhook_event  ******************");
      console.log({webhook_event});
 

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function

      if (webhook_event.referral) {
        handleReferral(sender_psid, webhook_event.referral);
      }
      else if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      }
      else if (webhook_event.postback) {
        handlePostBack(sender_psid, webhook_event.postback);
      } 
      else if (webhook_event.read) {
        console.log("message opened at "+ Date());
      }
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});


module.exports = router;
