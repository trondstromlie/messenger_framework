const express = require("express");
const router = express.Router();
const pug = require("pug");

//routes
router.get("/",function(req,res) {

  res.render('index',{"title":"Velkommen "})

});

router.get("/webview",function(req,res) {

  let query_message = " ";

  if(req.query.message) {
     query_message = req.query.message
  }else {
     query_message = "Hello"
  }
  

  res.render("webview", {"title":query_message});

});

module.exports = router;
