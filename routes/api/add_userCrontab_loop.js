"use strict";

const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const GlobalOperations = require('../../models/GlobalOperations');
const { put } = require('request-promise');

// @ GET api / messenger / add_userCrontab_loop / all_pages
// @ desc  get a list of all pages containg an active crontap
// @ public function  

router.get("/all_pages", async ( req , res ) => {

    try {

      let pages = await GlobalOperations.find();
      
      console.log({pages:pages});

      return res.status(200).json(pages);


    } catch (e) {
        console.error(e);
        res.status(500).send("server error");
    }
})

// @ GET api / messenger / add_userCrontab_loop
// @ desc  give a list of all active crontab, for page if sender_psid return all active crontab for user..
// @ public function require  page id optional sender_psid 

router.get('/:page_id', async ( req , res ) => {

    //we need some sort of acess controll here

    //if sender psid return list of a specific users crontabs
    //else return all active crontabs. 
    //you need a function to retrieve all page id's that contains a crontab

    try {

        let cron = await GlobalOperations.findOne({page_id:req.params.page_id});

        if(req.body.sender_psid ) {
            //filter out a list containg crontabs for spesific user

            let users_crontabs = cron.crontab_loop.filter(item => item.sender_psid == req.body.sender_psid);

            return res.status(200).json(users_crontabs);

        } else {

            return res.status(200).json(cron.crontab_loop);
            
        }
            

    } catch (e) {

        console.error(e);
        res.status(500).send("server error");

    }

 
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

            let unix_time = Date.now();
            console.log({unix_time:unix_time});

            let cron = await GlobalOperations.findOne({page_id});
            
            //if no cron db for this page is discovered create one else push the new cron jobs to the crontab array 

            if(!cron) {

              let crontab_loop = [];

              let current_crontab_obj = { sender_psid:sender_psid, timestamp:unix_time, custom_data_name:field_name, custom_data_value:field_value, messenger_process:messenger_process, page_id:page_id }

              crontab_loop.push(current_crontab_obj);

              cron = new GlobalOperations({page_id:page_id, crontab_loop:crontab_loop});

              await cron.save();

              res.status(200).json({crontab_loop:cron.crontab_loop})


            } else {

              let current_crontab_obj = { sender_psid:sender_psid, timestamp:unix_time, custom_data_name:field_name, custom_data_value:field_value, messenger_process:messenger_process, page_id:page_id}
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





//delete crontabs trigered by the tag hook function, when a users stops subscribing to a spesific tag etc 
//api accepts the arguments page_id , sender_psid , tag_name , tag value

// @ route  POST api / messenger / add_userCrontab_loop
// @ desc   add a user to the crontab 
// @ public function require sender_psid and page id

router.put("/", [
    check("sender_psid","sender_psid is required").not().isEmpty(),
    check("page_id","page_id is required").not().isEmpty(),
    check("field_name","field_name is required").not().isEmpty(),
    check("field_value","field_value is required").not().isEmpty(),
], async ( req , res ) => {

    let errors = validationResult(req);

    if(!errors.isEmpty()) {
        console.log({errors:errors});
        return res.status(300).json({Errors:errors});
    }else {

        try { 
         let {sender_psid,page_id,field_name,field_value} = req.body;

         let cron = await GlobalOperations.findOne({page_id});

          if(!cron) {
            console.log({error: "no page with this id exists"})
            res.status(300).json({"error":"there ar no outstanding jobs for this page id"});

         } else {

           console.log("*****************   PUT CRONTAB ****************");

           console.log({sender_psid:sender_psid, field_name:field_name,field_value:field_value});

           let clean = cron.crontab_loop.filter( (item ) => {
               console.log(item);
               if( ! ( sender_psid == item.sender_psid && field_name == item.custom_data_name && field_value == item.custom_data_value) ) {
                   return true;
               }
           });

           console.log({after_filter_cron: clean })

           cron.crontab_loop = clean;

           await cron.save();

           return res.status(200).json({cron_tab:cron.crontab_loop});


          }
        } catch (e) {
            console.error(e);
            res.status(500).send("server error");
        }  

    }
});

module.exports = router;