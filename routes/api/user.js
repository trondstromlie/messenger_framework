//user.js api services to add, update and log in the user
//
const express = require('express');
const jwt = require("jsonwebtoken");
const config = require('config');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');


// @ rout GET / api / user
// @ decs get a hello world message from route
// @ public
router.get('/', (req,res) => {
  res.send(" @ GET / api / user");
});

// @ rout POST / api / user / newuser
// @ decs Register a new user
// @ public
router.post('/newuser', [
  check("name","name is rquired").not().isEmpty(),
  check("email", "Email is required").isEmail(),
  check("password", "password is required").not().isEmpty()
], async( req , res ) => {

  errors = validationResult(req);
  if (!errors.isEmpty()) {
    //console.log(errors);
    return res.status(400).json({errors : errors.array()});
  }
  //register user in db
  try {
  const {name, email, password} = req.body;

  let user = await User.findOne({email});
  if(user) {
    return res.status(400).json({error:{msg:`There is already a ${req.body.email} registered`}})
  }
  const date = Date.now();
  user = new User({name, email, password, date});
  console.log(user.password);
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password,salt)
  console.log(user.password);

  await user.save();
  res.json({msg:`user ${user.email } is registered`});

} catch(err) {
  console.error(err.message);
  res.status(500).json({error:{msg:"server error"}});
}


});
// @ rout POST / api / user / auth
// @ decs Log in a user and get auth token
// @ public
router.get('/auth',[
    check('email','E-mail is required').isEmail(),
    check('password','password is required').not().isEmpty()
  ] , async ( req , res ) => {
    errors = validationResult(req);

    if(!errors.isEmpty()) {
      console.log(errors);
      return res.status(401).json({ errors: errors.array() });
    }
    //** checkk if user exixts and send login-token **
    try {
    const {email,password} = req.body
    let user = await User.findOne({ email });
    if(!user) {
      return res.status(401).json({error:{msg:"wrong username or password"}});
    }

    let isMatch = await bcrypt.compare(req.body.password,user.password);
    if(!isMatch) {
      return res.status(401).json({error:{msg:"wrong username or password"}});
    }

    const payLoad = { user: user.id };
    jwt.sign(
      payLoad,
      config.get('jwtToken'),
      {expiresIn:'300000'},
      (err,token) => {
        if(err) throw err;
        res.json({"status":"logged in",token})
      }
    );

  }catch(err) {
    console.error(err.message);
    return res.status(500).send("server error");
  }

});



module.exports = router;
