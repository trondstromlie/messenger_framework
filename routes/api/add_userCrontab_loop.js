"use strict";

const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const GlobalOperations = require('../../models/GlobalOperations');

// @ GET api / messenger / add_userCrontab_loop
// @ desc   add a user to the crontab 
// @ public function require sender_psid and page id

router.get('/', ( req , res ) => {
    res.send("@ GET api / messenger / add_userCrontab_loop");
});


// @ route  POST api / messenger / add_userCrontab_loop
// @ desc   add a user to the crontab 
// @ public function require sender_psid and page id
router.post('/' , [ 
    check("sender_psid","sender_psid is required").not().isEmpty(),
    check("timestamp","timestamp is required").not().isEmpty(),
    check("field_name","field_name is required").not().isEmpty(),
    check("field_value","field_value is required").not().isEmpty(),
    check("messenger_process", "messenger_process is required").not().isEmpty(),
    check("page_id", "page_id is required")
], async ( req , res ) => {

    let errors = validationResult(req);

    if(!errors.isEmpty()) {
       return res.status(300).json({errors})
    } else {

        try{

            //write the data to the database.

            let {sender_psid , timestamp, field_name, field_value, messenger_process, page_id } = req.body;

            let cron = await GlobalOperations.findOne({page_id});
            
            //if no cron db for this page is discovered create one else push the new cron jobs to the crontab array 

            if(!cron) {

              let crontab_loop = [];

              let current_crontab_obj = { sender_psid:sender_psid, timestamp:timestamp, field_name:field_name, field_value:field_value, messenger_process:messenger_process, page_id:page_id}

              crontab_loop.push(current_crontab_obj);

              cron = new GlobalOperations({page_id:page_id, crontab_loop:crontab_loop});

              await cron.save();

              res.status(200).json({crontab_loop:cron.crontab_loop})


            } else {

              let current_crontab_obj = { sender_psid:sender_psid, timestamp:timestamp, field_name:field_name, field_value:field_value, messenger_process:messenger_process, page_id:page_id}
              cron.crontab_loop.push(current_crontab_obj);

              await cron.save();

              res.status(200).json({crontab_loop:cron.crontab_loop})

            }



            console.log(cron);


        } catch(e) {

            console.error(e);
            res.status(500).send("server error");

        }
    }
});


module.exports = router;