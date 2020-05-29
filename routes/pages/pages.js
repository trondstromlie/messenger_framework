const express = require("express");
const router = express.Router();
const pug = require("pug");

//routes
router.get("/",function(req,res) {

  res.render('index',{"title":"Velkommen "})
});

module.exports = router;
