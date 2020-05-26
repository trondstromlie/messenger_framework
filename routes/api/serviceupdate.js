//serviceuppdate.js api services handle and update the messaging platforms
//
const express = require('express');
const router = express.Router();

// @ rout GET / api / serviceupdate
// @ decs get a hello world message from route
// @ public
router.get('/', (req,res) => {
  res.send(" @ GET / api / serviceupdate");
});





module.exports = router;
