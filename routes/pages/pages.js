const express = require("express");
const router = express.Router();
const pug = require("pug");

//import the messenger data functions to fetch userdata from the api 

const fetchUserData = require("../../messengerApp/controllers/fetchUserData");

//routes
router.get("/",function(req,res) {

  res.render('index',{"title":"Velkommen "});

});


// build a webview that when the user click the button update a custom_data field and close the window and start
// a new function in the messenger conversation 
// for this you need the api that send a message and starts a new process....

router.get("/webview", async function(req,res) {

  console.log("Starting the webview");

  let query_message = "Hello";
  let sender_psid = null;
  let user_data = {};

  if(req.query.message)  query_message = req.query.message;
  if(req.query.sender_psid)  sender_psid = req.query.sender_psid;

  console.log({sender_psid:sender_psid});

  if( sender_psid !== null ) {
    user_data = await fetchUserData(sender_psid);
  }
  
  //fetch the userdata from the user_db 


  res.render("webview", {"title":query_message,"sender_psid":sender_psid,"name":user_data.user.name,"profile":user_data.user.});

});

module.exports = router;
