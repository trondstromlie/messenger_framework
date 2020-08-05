const express = require("express");
const router = express.Router();
const pug = require("pug");

//routes
router.get("/",function(req,res) {

  res.render('index',{"title":"Velkommen "})

});

router.get("/webview",function(req,res) {

  res.render("webview");

});

module.exports = router;
