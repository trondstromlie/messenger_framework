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
  messenger_processes:[
    {
      process_name:{
              type:String,
              required:true
           },
      process_status:{
              type: Boolean,
              default:false
      },
      process_progress:{
              type:String
      },
      process_steps:{
              type:Array
      },
      process_expires:{
              type:Date,
              required:true
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
    first_name:{
      type:String
    },
    message:{
      type:String,
      required:true
    },
    sender_psid: {
      type:String,
      required:true
    },
    sender_avatar: {
      type:String,
    }    
  }],
  custom_data: [{
    field_name:{
      type:String
    },
    field_value:{
      type:String
    }
  }]
});

module.exports = messenger_user = mongoose.model("messenger_user", MessengerUserSchema) ;
