
const request = require('request');
const custom_fields_hook = require('./custom_fields_hook');

//****************************
//Update userfield using the messenger_user_API

async function add_or_update_custom_data ( sender_psid , user_obj , field_obj  ) {
  
  console.log("writing custom fields to db")
  console.log( { field_obj  : field_obj } );

  let json = { sender_psid:sender_psid, field_name:field_obj.field_name, field_value:field_obj.field_value  }

  //create a hook 

  //to discover if a field is updated, if (old value is not the same as new walue run throug the hook functions.
  //event is change in customfield etc  ) 

  console.log({add_update_user_obj:user_obj});

  //first check if customfield exists 

  let check_for_customfield = user_obj.custom_data.filter( item => item.field_name == field_obj.field_name);
  
  if (check_for_customfield.length > 0) {

  user_obj.custom_data.forEach(async (item) => {

    
    
    if (item.field_name == field_obj.field_name && item.field_value != field_obj.field_value) {

      console.log("************** change is value discovered");
      await custom_fields_hook({ sender_psid: user_obj.sender_psid , hook_type: "custom_field", event: "change_value", field_name:item.field_name, field_value: item.field_value});

    } else {
      console.log(" *********** no changes has been discovered ************ ");
      console.log(item.field_name + "s value = " + item.field_value );

    }

  });
} else {
  console.log("**************** new data discovered starting sending controll to the hook *************")
  await custom_fields_hook({ sender_psid: user_obj.sender_psid , hook_type: "custom_field", event: "new_field", field_name:field_obj.field_name, field_value: field_obj.field_value});
}

  //check edit subscription data in crontab hook


  let options = {
    url:"https://phonestats.herokuapp.com/api/messenger/messenger_processes/customfields",
    method:"POST",
    json:json
  };

  return new Promise( ( resolve , reject ) => {
    request(options , ( err, res, body ) => {
      if(err) {
        reject(err);
      } else {
        console.log({"add or update function ":body});
        resolve(body);
      }
    });

  });

  };

//*******
//add or reset user_process
//next step create process to reset_user_process

async function add_user_process( sender_psid , process_name , user_obj ) {

  // if user process is not already in user data
  //create it if user_process is already in  db reset it to step 0
  //connect to messenger API

  let process_steps = 0;
  let process_progress = 0;
  let _user_data = user_obj;

  let json = {sender_psid:sender_psid,process_name:process_name,process_progress:process_progress,process_steps:process_steps};

  let options = {
    url:"https://phonestats.herokuapp.com/api/messenger/messenger_processes",
    method:"POST",
    json:json
  };



 return new Promise( (resolve , reject) => {
   request(options, (err, res , body) => {
     if(err) {
       console.error(err.message);
       reject(err);

     } else {

       resolve(body);
     }
   });
});// end of promise
} //add user_process

async function update_process_progress ( sender_psid, process_name, process_status, process_progress )  {


  let json = {sender_psid:sender_psid, process_name:process_name}

  if(process_status !== null) json.process_status = process_status;
  if(process_progress !== null) json.process_progress = process_progress;

  let options = {
    url:"https://phonestats.herokuapp.com/api/messenger/messenger_processes",
    method:"PUT",
    json:json
  };

  console.log(json);

  return new Promise( ( resolve , reject ) => {
    request(options, ( err, res, body ) => {
      if(err) {
        reject(err);
      } else {
        resolve(body);
      }
    });

  });
};


async function delete_messenger_process (sender_psid, process_name) {

  let options = {
      url : "https://phonestats.herokuapp.com/api/messenger/messenger_processes",
      method:"DELETE",
      json:{sender_psid:sender_psid,process_name:process_name}
  };

  //starting the promise here
  return new Promise( ( resolve , reject ) => {
      //do the async stuff here

      request( options, ( err , res , body ) => {
          if(err) {
              reject(err);
          } else {
              resolve(body);
          }
      });
  });
};

async function delete_custom_field (sender_psid, field_name) {
  let options = {
      url : "https://phonestats.herokuapp.com/api/messenger/messenger_processes/customfields",
      method:"DELETE",
      json:{sender_psid:sender_psid,field_name:field_name}
  };

  //starting the promise here
  return new Promise( ( resolve , reject ) => {
      //do the async stuff here

      request( options, ( err , res , body ) => {
          if(err) {
              reject(err);
          } else {
              resolve(body);
          }
      });
  });
};


//export functions
module.exports = {
  add_user_process:add_user_process,
  update_process_progress:update_process_progress,
  add_or_update_custom_data:add_or_update_custom_data,
  delete_messenger_process:delete_messenger_process,
  delete_custom_field:delete_custom_field
};
