"use strict";


async function custom_field_hooks ( hook_data_obj ) {

    let { hook_type, event, field_name, field_value } = hook_data_obj;

    //set page id here since we at this moment only operate with one page

    let page_id = "104680997936481";


    if (hook_type = "custom_field"  && event == "change_value") {
       
        //start the delete from crontab function here 
        
       
    }

}


