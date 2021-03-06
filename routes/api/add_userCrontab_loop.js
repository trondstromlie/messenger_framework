"use strict";
//****************************************** */
//todo:
// create a api to delete pages with page_id to drop empty chemas

//****************************************** */

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

      let cron_db = await GlobalOperations.find();
      
      let pages = [];

      for(let item of cron_db) {
          if(item.page_id) pages.push(item.page_id);
      }

      return res.status(200).json({pages:pages});


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
// @ desc   add  a user to the crontab 
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

              let current_crontab_obj = { sender_psid:sender_psid, timestamp:timestamp, custom_data_name:field_name, custom_data_value:field_value, messenger_process:messenger_process, page_id:page_id }

              crontab_loop.push(current_crontab_obj);

              cron = new GlobalOperations({page_id:page_id, crontab_loop:crontab_loop});

              await cron.save();

             return res.status(200).json({crontab_loop:cron.crontab_loop})


            } else {

              let current_crontab_obj = { sender_psid:sender_psid, timestamp:timestamp, custom_data_name:field_name, custom_data_value:field_value, messenger_process:messenger_process, page_id:page_id}
              cron.crontab_loop.push(current_crontab_obj);

              await cron.save();

              return res.status(200).json({crontab_loop:cron.crontab_loop})

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

router.delete("/", [
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

// @ route  PUT api / messenger / add_userCrontab_loop
// @ desc   update the crontab-loop content send the updated array, the api updates the array in the the database. 
// @ public function require page_id

router.put("/", [
    check("page_id", "page_id is required").not().isEmpty()
], async ( req , res) => {

    let errors = validationResult(req);

    if(!errors.isEmpty()) {
        console.log(errors);
        res.status(300).json(errors);

    } else {

    console.log({put_api: req.body});    

    let { page_id , cron_tab_loop } = req.body;

    let page_cron_tab = await GlobalOperations.findOne({page_id:page_id});

    if(page_cron_tab) {

        page_cron_tab.crontab_loop = cron_tab_loop;

        console.log({DELETE_add_user_crontab: page_cron_tab})

        let the_save = await page_cron_tab.save();

        console.log({"save": the_save})

        return res.status(200).json(page_cron_tab);

    } else {
        console.log("error no crontab for this page discovered")
        res.status(300).json({error:"No crontab for this page discovered "})

    }

    }

});

module.exports = router;