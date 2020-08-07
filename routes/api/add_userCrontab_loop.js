"use strict";

const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const GlobalOperation = require('../../models/GlobalOperations');


router.get('/' , [ 
    check("sender_psid","sender_psid is required").not().isEmpty(),
    check("timestamp","timestamp is required").not().isEmpty(),
    check("field_name","field_name is required").not().isEmpty(),
    check("field_value","field_value is required").not().isEmpty(),
    check("messenger_process", "messenger_process is required").not().isEmpty()
], async ( req , res ) => {

    let errors = validationResult(req);

    if(!errors.isEmpty()) {
       return res.status(300).json({errors})
    } else {

        try{

            //write the data to the database.

            let cron = await GlobalOperation.find();

            console.log(cron);


        } catch(e) {

            console.error(e);
            res.status(500).send("server error");

        }
    }
} ) ;


module.exports = router;