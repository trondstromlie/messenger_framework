const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = async ( req, res, next ) => {

  //get x-aut-token from header
  const token = req.header('x-auth-token');
    if(!token) {
      return res.status(401).json({error:{msg:"No token authorization denied"}});
    }
  //check if user is registered else return not logged in message.
    try {
      const decode = jwt.verify(token, config.get("jwtToken"));
      req.user = decode.user;
      next();
    }catch(err) {
      console.error(err.message);
      res.status(402).send("token has expired");
    }

  //todo if token is vallid update token ?

};
