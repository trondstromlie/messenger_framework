const mongoose = require("mongoose");


//User db Schema
const UserSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  sender_psid:{
    type:String
  },
  date:{
    type:Date,
    required:true
  },
  msg_service:{
    messenger:{type:String},
    google:{type:String}
  }
});

module.exports = user = mongoose.model('user', UserSchema);
