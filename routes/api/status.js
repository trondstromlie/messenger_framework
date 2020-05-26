//user.js api services to add and update the status
//
const express = require('express');
const User = require('../../models/User');
const router = express.Router();
const auth = require('../../middelware/auth');
const { check , validationResult } = require('express-validator');

// @ rout GET / api / status
// @ decs get a hello world message from route
// @ public
router.get('/', (req,res) => {
  res.send(" @ GET / api / status");
});


router.post('/status', [auth,[
  check("status","The status field is required")
]], async (req,res) => {
  try {

    let user = await User.findOne({_id : req.user});
    if(!user) {
      res.status(401).json({error:{msg:"no user with this token"}});
    }
    res.status(200).json({data:{user:user.name ,userID:req.user}});

  }catch(err) {
    conole.error(err.message);
    res.status(500).send("server error");
  }

});


module.exports = router;
