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
                required:true
            },
            timestamp:{
                type:Date,
                required:true
            },
            messenger_process:{
                type:String,
                required:true
            },
            custom_data_name:{
                type:String,
                required:true
            },
            custom_data_value:{
                type:String,
                required:true
            }

        }
    ]
});

module.exports = cron_tab = mongoose.model('cron_tab', GlobalOperations);
