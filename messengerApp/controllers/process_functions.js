"use strict";
const {check , validationResult} = require('express-validator');

const rl = readline.createInterFace({
  input:process.stdin,
  output:process.stdout
});

const callSendAPI = require('./callSendAPI');


//**************************************************************


async function get_email(sender_psid, name , msg ) {

  console.log("get_email");
  //get email from the user


  rl.question("Skriv din epost her ? >> ", ( email ) => {


   const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

   if (re.test(email)) {
     console.log("this is a valid email");

     //do something
   } else {

     console.log("this is not a valid email");

     //do something else!
           }
 });
};


async function get_text_innput (sender_psid, name, msg) {
  console.log("get text input");
  //get

}

async function confirm_data(sender_psid, name, msg) {
  console.log("confirm_data");
  //hvis responce ikke er null, send ttext feltet, (du sa)
  //er det riktig?
  //send forespørsl om request,
  //hvis ja returner next
  //update db

  //hvis nei hopp en funksjon tilbake start prosess på nytt

}

async function send_empty_message(sender_psid, name, msg) {

  //send message send message move to next step in prosess

}


// functions to be exported

module.exports = {
  get_email:get_email,
  get_text_innput:get_text_innput,
  confirm_data:confirm_data
};
