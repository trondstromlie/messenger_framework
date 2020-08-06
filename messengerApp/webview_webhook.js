"use strict";
const express = require('express');
const router = express.Router();
const config = require('config');
const handlePostBack = require('./controllers/handlePostback');
const { check , validationResult } = require('express-validator');

// @ Route messengerapp/webview_webhook
// @ desc  get responce to test the uri
// @ acess public
router.get("/", (req, res) => {
    res.send("GET @ messengerapp/webview_webhook");
});



router.post("/",[
    check("sender_psid", "sender_psid is required").not().isEmpty(),
    
], async (req , res) =>{
    let errors = validationResult(req);
    if(!errors.isEmpty) {

        return res.status(300).json(errors);

    } else {

     try {

        let body = req.body;
        await handlePostBack(body.sender_psid, body)

        return res.status(200).json({"status":200});

      //you need to add som more checks here, like a uniqe id for the webview, a page id etc for now make it simple....
      //do the logic here
      //the request should be fomated with as a stringified object 

     } catch (e) {
         console.error(e);
         res.status(500).send("server error");
     }  
      
    }
});



module.exports = router;
