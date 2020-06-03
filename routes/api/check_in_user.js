const User = require('../../models/User');
const express = require("express");
const router = express.Router();
const { check  , validationResult } = require('express-validator');


// @ROUT GET  API / check_in_user
// @DESC  check if a user i already registered for the service if not start the registration process

router.get('/',[
  check("sender_psid","sender_psid is required").not().isEmpty()
  ], async ( req, res ) => {
   // send the sender_psid to the api to check if this user is registered
   let errors = validationResult(req);

   if(!errors.isEmpty()) {
     console.log(errors);
     res.status(301).json(errors);
   } else {

   try {

     console.log(req.body.sender_psid)
     user = await User.findOne({ "sender_psid":req.body.sender_psid });

     if(!user) {
       console.log("no user")
       return res.status(301).json({"error":{"msg":"er det første gang du bruker denne appen? Før du kan bruke appen må du registrer deg med epost adresse"}})
     }else {
       return res.status(200).json({status:{status:"ok"}})
     }
   } catch(e) {
     console.error(e.message);
      return res.status(500).send("server error");
   }
   }
  });


  // @POST / API / check_in_user
  // Desc  if the sender_psid is not registered ask for email if email exists add PSID to the users
  // and subscribr user to update event.
  router.post('/', [
    check("sender_psid","sender_psid is required").not().isEmpty(),
    check("email","email is required").isEmail()
  ], async (req,res) => {
    errors = validationResult(req);
    if(!errors.isEmpty()) {
      console.log(errors);
      res.status(300).json(errors);
      }
    try {
      user = await User.findOne({"email":req.body.email})
      if(user) {
      console.log(user);
      res.status(200).json({status:{status:"ok",msg:"Du er registrert"}});
    }
    else {
      res.status(301).json({status:{status:"error",msg:"Du må være registrert for å bruke denne tjenesten, kontakt Trond på mybestlabs@gmail.com"}})
    }

    } catch(e){
      console.error(e.message);
    }
  });
  module.exports = router;
