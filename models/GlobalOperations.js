const mongoose = require('mongoose');

const GlobalOperations = new mongoose.Schema({
    page_id:{
        type:String,
        required:true

    },
    crontab_loop: [
        {
            sender_psid:{
                type:String,
                
            },
            timestamp:{
                type:Date,
                
            },
            messenger_process:{
                type:String,
               
            },
            custom_data_name:{
                type:String,
                
            },
            custom_data_value:{
                type:String,
                
            }

        }
    ]
});

module.exports = cron_tab = mongoose.model('cron_tab', GlobalOperations);
