const express = require("express");
const router = express.Router();
const pug = require("pug");

//import the messenger data functions to fetch userdata from the api 

const fetchUserData = require("../../messengerApp/fetchUserData");

//routes
router.get("/",function(req,res) {

  res.render('index',{"title":"Velkommen "});

});

router.get("/webview",function(req,res) {

  let query_message = "Hello";
  let sender_psid = null;
  let user_data = {};

  if(req.query.message)  query_message = req.query.message;
  if(req.query.message)  query_message = req.query.sender_psid;

  if( sender_psid !== null ) {
    user_data = fetchUserData(sender_psid);
  }
  
  //fetch the userdata from the user_db 



  res.render("webview", {"title":query_message,"name":user_data.user.name});

});

module.exports = router;
