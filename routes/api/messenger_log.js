"use strict";

const express = require('express');
const router = express.Router();
const MessengerUser = require('../../models/MessengerUser');
const { check, validationResult } = require('express-validator');

// @ Route GET / api /messenger / messengerlog / #sender_psid
// @ DESC  get log all messages from spesific user
// @ ACCESS Private ....
router.get('/:sender_psid', ( req , res ) => {

  res.send("@ GET api / messenger / messenger_log / id: "+ req.params.sender_psid);
  console.log(req.params)

});

// @ Route PUT / api /messenger / messengerlog
// @ DESC  Add messages from user to log
// @ ACCESS Private ....
router.put('/', [
  check("sender_psid","sender_psid is required").not().isEmpty(),
  check("first_name","first_name is required").not().isEmpty(),
  check("message", "message is required").not().isEmpty()
] , async ( req , res ) => {

  let errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(300).json(errors);
  } else {

    try {


    let user = await MessengerUser.findOne({"sender_psid":req.body.sender_psid})
    console.log("user");

    if(user) {

      let {sender_psid,
           first_name,
           message,
           avatar  } = req.body;

      let date = Date.now();

      let message_fields = {"sender_psid":sender_psid, "first_name":first_name,"message":message,"avatar":avatar,"date":date};


      user.message_log.unshift(message_fields);
      user.save()

      return res.status(200).json({"status":200,"msg":"message stored in log",message_fields});

  } else {
    return res.status(300).json({"status":300,"msg":"no user with this sender_psid" })
  }


  } catch (e) {
    console.error(e.message);
    return res.send("server error");
  }

  }

  res.send("POST api / messenger / messenger_log");
      res.send("no post options ond this endpoint");
});







module.exports = router;
