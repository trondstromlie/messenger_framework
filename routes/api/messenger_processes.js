"use strict";
const express = require('express');
const router = express.Router();
const MessengerUser = require('../../models/MessengerUser');
const { check , validationResult } = require('express-validator');

// @ Router : GET api / messenger / messenger_processes
// @ Desc : Get a list of prosesses for this messenger user ongoing pros is tagged true, progress is number for this prosess
// @ acess Public
router.get('/', [
  check('sender_psid', "sender_psid is required").not().isEmpty()
], async ( req , res ) => {
   let errors = validationResult(req);
   if(!errors.isEmpty()) {
     console.log(errors);
     return res.status(300).json(errors);
   } else {

     try {

      let user = await MessengerUser.findOne({"sender_psid":req.body.sender_psid});
      if (user) {

        return res.json({res:user.messenger_processes}) ;

      } else{

        console.log("no user with this psid " + req.body.sender_psid)
        return res.status(300).json({"status" : 300, msg : "there is no user with this PSID" });

      }

     } catch (e) {
       console.log(e.essage);
       return res.status(500).send("server error")
     }
   }


  //End get list of processes

} );

// @ Router : POST api / messenger / messenger_processes
// @ Desc : create new prosess for registered user with psid
// @ acess Public with psid

router.post('/', [
  check('sender_psid', 'sender_psid is required').not().isEmpty(),
  check('process_name', 'process name is requires').not().isEmpty()
] , async ( req , res ) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
      console.log(errors);
      return res.status(300).json({"status":300,errors});

    } else {

      try {

      let user = await MessengerUser.findOne({'sender_psid':req.body.sender_psid});

      if(user) {

        let {  process_name,
               process_progress,
               process_steps
            }= req.body;

        let date = new Date();
        //add one day to date
        date.setDate(date.getDate()+1);
        let process_expires = Date.parse(date);
        let process_status = true;

        console.log(user);

        user.messenger_processes.unshift({process_name, process_progress, process_steps, process_status, process_expires});
        await user.save();
        return res.status(200).json(user);


      } else {
        console.log("errr noe user " + sender_psid);
        res.status(300).json({"status":"300","msg":"No user with this psid"})
      }

      } catch (e) {
        console.error(e.message);
        return res.status(500).send("server error");
      }
    }

  //add new process

});

// @ Router : PUT api / messenger / messenger_processes
// @ Desc : update active process or edit process details
// @ acess Public
router.put('/', [
  check("sender_psid", "sender_psid is reqired").not().isEmpty(),
  check("process_name", "process_name is reqired").not().isEmpty()
], async ( req , res ) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
      console.log(errors) ;
      return res.status(300).json({errors});
      } else {

          try{

            let user = await MessengerUser.findOne({"sender_psid":req.body.sender_psid});

            if (user) {

              for(var i = 0 ; i < user.messenger_processes.length ; i++) {

                if( user.messenger_processes[i].process_name === req.body.process_name) {

                  //if process found update this this process


                  if(req.body.process_progress) user.messenger_processes[i].process_progress = req.body.process_progress;
                  if(req.body.process_steps) user.messenger_processes[i].process_steps = req.body.process_steps;
                  if(req.body.process_expires) user.messenger_processes[i].process_expires = req.body.process_expires;
                  if(req.body.process_status) user.messenger_processes[i].process_status = req.body.process_status;

                  console.log(user.messenger_processes[i])


                  const update_user = await MessengerUser.findOneAndUpdate(
                        {  sender_psid  :  req.body.sender_psid},
                        {  $set : user },
                        {  new  :  true });

                        return res.json({msg:"process updated",user:user.messenger_processes[i]});



                   }
                 }  return res.statu(300).json({msg:"no process with this name found"});
               } else {
                 console.log("no user found");
                 return res.status(300).json({msg:"no user found"});
               }

          }catch(e) {
            console.log(e.message);
            return res.status(500).send("server error");
          }
   }
  //update prosess progress and status
  //fex when prosess is finished change status from active to false.
});

// @ Router : POST api / messenger / messenger_processes / customfields
// @ Desc :  add or update customfields
// @ acess Public

router.post('/customfields', [
  check("sender_psid","sender_psid is required").not().isEmpty(),
  check("field_name", "field_name is required").not().isEmpty(),
  check("field_value", "field_value is required").not().isEmpty()
], async ( req , res ) => {

  let errors = validationResult(req);
  if(!errors.isEmpty()) {
    console.log(errors);
    return res.status(300).json({"status":300, errors});
  } else {

    try {

    let user = await MessengerUser.findOne({"sender_psid":req.body.sender_psid});


    //use filter to check if the custom data name allready exists


    let check_for_field_name = await user.custom_data.filter( item => {
      if(item.field_name === req.body.field_name) {
        return item;
      }

    })

    //if name already exists update

    if(check_for_field_name.length > 0) {

      console.log({msg:"updating field name",check_for_field_name});

      let update_custom_data = await user.custom_data.map( item => {
        if ( item.field_name === req.body.field_name ) {
          item.field_value = req.body.field_value;
          return item;
        }else {
          return item;
        }
      })
    let update_user_fields = user;

    console.log({custom_data:update_custom_data})
    update_user_fields.custom_data = update_custom_data;
    console.log(update_user_fields);

    let update_the_user = await MessengerUser.findOneAndUpdate(
                            {sender_psid:req.body.sender_psid},
                            {$set: update_user_fields},
                            {new:true});

    console.log({update_user:update_user_fields.custom_data});
    return res.status(200).json(update_user_fields.custom_data);

    } else {
      console.log("creating new field");
      user.custom_data.push({field_name: req.body.field_name, field_value:req.body.field_value});
      await user.save();
      res.status(200).json(user.custom_data);
    }

  }catch (e) {
    console.log(e.message);
    return res.status(500).send("server error");

  }

    }
 });

module.exports =  router;
