
const request = require('request');

//***u*************************
//Update userfield using the messenger_user_API
async function update_custom_field ( sender_psid , user_obj , field_obj  ) {

  try {


    // connect to messenger API too update fields
    //create a promise function using request


  } catch (e) {
    console.error(e.message);
  }

}

//*******
//add or reset user_process
//next step create process to reset_user_process

async function add_user_process(sender_psid, process_name) {

  // if user process is not already in user data
  //create it if user_process is already in  db reset it to step 0
  //connect to messenger API
  let process_steps = 0;
  let process_progress = 0;
  let user_data = user_obj;
  let json = {sender_psid:sender_psid,process_name:process_name,process_progress:process_progress,process_steps:process_steps};

  let options = {
    url:"https://phonestats.herokuapp.com/api/messenger/messenger_processes",
    method:"POST",
    json:json
  };



 return new Promise( (resolve , reject) => {
   request(options, (err, res , body)) {
     if(err) {
       console.error(err);
       reject(err);

     } else {
       console.log(body);
       resolve(body);
     }
   });
});// end of promise
} //add user_process



//export functions
module.exports = {
  add_user_process:add_user_process,
  update_custom_field:update_custom_field
};
