const Mess_user = require('../../models/MessengerUser');
const express = require("express");
const router = express.Router();
const { check  , validationResult } = require('express-validator');

// router GET messenger / API
//
router.get("/", [
  check("sender_psid","sender_psid is required").not().isEmpty()
], async (req , res) =>  {
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
      console.log(errors);
      res.status(310).json({errors:errors});
    } else {

      try {
        console.log(req.body.sender_psid);

      let user = await Mess_user.findOne({sender_psid:req.body.sender_psid});
      if(user){
        return res.status(200).json({status:200,user:user});
      } else {
        return res.status(300).json({"status":300,"error":"no user with this psid"});
      }

    } catch(e) {
      console.error(e.message);
    }
    }
});


// @ rout POST / api / messenger / messenger_user_details
// @ desc add or uppdate messenger profile
router.post("/", [
  check("id", "sender_psid is required").not().isEmpty()
], async ( req, res ) => {
  let errors = validationResult(req);
  if(!errors.isEmpty()) {
    console.log(errors);
    res.status(300).json({"status":300,"errors":errors});
  } else {

    try {

      //add or update user
      var user = await Mess_user.findOne({sender_psid:req.body.sender_psid});

      //if not user add user to db
      if(!user) {

        let {
          first_name,
          last_name,
          name,
          sender_psid,
          profile_pic
        } = req.body;

        date = Date.now();

        user = new Mess_user({first_name,last_name,name,sender_psid,profile_pic,date});

        await user.save();

        console.log(user);
        return res.status(200).json(user);

      }

      else{

        console.log("updating existing user " + req.body.sender_psid);
        //update user data
        const update_userfields = {};

        if(req.body.first_name) update_userfields.first_name = req.body.first_name;
        if(req.body.last_name)  update_userfields.last_name = req.body.last_name;
        if(req.body.name) update_userfields.name = req.body.name;

        console.log(update_userfields)

        console.log(req.body.sender_psid);
        console.log(update_userfields);
        user = await Mess_user.findOneAndUpdate(
            { sender_psid : req.body.sender_psid },
            { $set : update_userfields},
            { new : true}
          );
        console.log(user)
        return res.send(user);

      }
    }catch(e) {
      console.error(e.message);
      res.status(500).send("server error");
    }
  }
});

module.exports = router;
