"use strict";
const addandupdate_crontab = require('./addandupdate_crontab');


async function custom_field_hooks ( hook_data_obj ) {

    let { sender_psid , hook_type, event, field_name, field_value } = hook_data_obj;

    //set page id here since we at this moment only operate with one page

    let page_id = "104680997936481";


    if (hook_type = "custom_field"  && event == "change_value") {
       
        //start the delete from crontab function here 
        console.log("************* starting the hook for changed custom data************")
        hook_data_obj.page_id = page_id

        addandupdate_crontab.delete_user_crontab_on_unsubscribe(hook_data_obj);
        return NaN;

       
    } else if (hook_type = "custom_field"  && event == "new_field") {
        console.log("*********** starting the hook for new custom_data here **************");
        return NaN;
    }

}

module.exports = custom_field_hooks;
