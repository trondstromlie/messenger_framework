const mongoose = require("mongoose");

const MessengerUserSchema = new mongoose.Schema({
  sender_psid:{
    type:String,
    required:true
  },
  first_name:{
    type:String
  },
  last_name:{
    type:String
  },
  name:{
    type:String
  },
  date:{
    type:Date,
    required:true    
  },
  prosess:[
    {
      name:{
             type:String
           },
      status:{
              type: Boolean,
              default:false
      },
      progress:{
              type:String
      },
      steps:{
              type:Array
      }
    }
  ],
  subscriptions:[
    {
      name:{
        type:String,
      },
      status:{
        type:Boolean,
        default:false
      }
    }
  ],
  message_log:[{
    date:{
    type:Date
    },
    sender_name:{
      type:String
    },
    message:{
      type:String
    }
  }]
});

module.exports = messenger_user = mongoose.model("messenger_user", MessengerUserSchema) ;
