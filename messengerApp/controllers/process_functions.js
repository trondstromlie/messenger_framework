"use strict";

const sleep = require('sleep-promise');
const callSendAPI = require('./callSendAPI');
const addandupdate_userfields = require('./addandupdate_userfields');


//********************************************************************* */
//** invisible function to read value of bool custom value */
// if value is true jump to if value is false jump to 

async function read_bool_value_of_custom_field (sender_psid, user, message, custom_field_name, quick_reply_obj, in_message , bool_obj, jump_to ,err_message) {

  try {

    let user_field = user.custom_data.filter(item => item.field_name === custom_field_name);
    console.log(user_field);

    if(! user_field.length > 0 )  {
      console.log("could not find this user_field");

    } else {

      //check if the value is === or not === to the one specified in bool_obj
      //bool object {condition: !== === , test: true,false,custom value}
      
      let condition = user_field.value === bool_obj.test;

      if(condition === true) {
        console.log("fant verdien");
        return {status:true,step:"next"};
      } else {
        console.log("fant ikke verdien")
        return {status:true,step:"next"};
      }

    }
  } catch (e) {

    console.error(e.message);
  }
}


//*********************************************************************
//** invisible function to add a custom field with a boolean value 
//** f.eks subscription data subscribing to field -- newsletter:true */

async function add_bool_custom_value(sender_psid, user, message, custom_field_name, quick_reply_obj, in_message , bool_obj, jump_to ,err_message) {

  try {

    await addandupdate_userfields.add_or_update_custom_data(sender_psid,field_name,field_value);

    return {status:false,step:"next"}

  } catch (e) {

    console.log(e.message);
  }
  
  

};

//*********************************************************************** */
//******function Jump to process

async function jump_to_process(sender_psid, user, message, custom_field_name, quick_reply_obj, in_message , bool_obj, jump_to ,err_message) {

  console.log("******* jump to process " + quick_reply_obj.link.messenger_process);

  // Update quick reply link to be an objeckt, can contain link.index number and link.messenger_process
  // process is waiting for an answer from a quick reply 
  // delete all active  processes and start the next process.
  // Add new process to db and start step one, 
  // find index of process, ps will alwais be 0 or one since we start with deleting all.
  //return false breaks the process.

  //send optional message to user if message is !== null
  //send message before starting the new process
  try {

    if(msg !== null) {
      let response = {text:msg};
      await callSendAPI(sender_psid,response);
    }
  
    return {status:false,step:"pause"}

  } catch(e) {
    console.error(e.message);
  }


  
}


//**************************************************************
//send a string of text, include a quick reply object to add a quick reply

async function ask_for_custom_data (sender_psid, user, message, custom_field_name, quick_reply_obj, in_message , bool_obj, jump_to ,err_message) {

  console.log("Ask for custom data and pause");

  let string = msg;
  let response = {text:msg};

  if(custom_field_name !== null) {
    let custom_field = user.custom_data.filter(item => item.field_name === custom_field_name)

   response = {text:msg.replace("{<custom_field>}", custom_field[0].field_value)};
   await callSendAPI(sender_psid, response, "RESPONSE")

   return {status:true,step:"pause"};
  }
  else {

    console.log(response);

    await callSendAPI(sender_psid, response,"RESPONSE")

    return {status:true,step:"pause"};
  }


}
//***********
//function som viser en input data , sender quick reply for å bekrefte
//du skrev dette, er de riktig.

async function listen_for_quick_reply(sender_psid, user, message, custom_field_name, quick_reply_obj, in_message , bool_obj, jump_to ,err_message) {

  console.log("Listen for quick_replies confirm_data");


  let prompt_for_answer = incoming_msg.text;
  console.log({quick_reply_obj:quick_reply_obj,prompt_for_answer:prompt_for_answer});

  let answer = await quick_reply_obj.filter( (item) => {

    return item.title === prompt_for_answer
  })
  console.log({answer_listen_for_quick_reply: answer});

  if(answer.length > 0) {

     console.log({found:answer});

     return {status:true,step:"jump_to",link:answer[0].link};

   } else {
     await callSendAPI(sender_psid, {text:"dette var ikke svaret jeg forventet, bruk knappene over for å velge ditt svar "}, "RESPONSE");

     console.log("dette svaret var ikke det jeg forventet :) bruk knappene over for å velge ditt svar ");
     return {status:true,step:"restart"};
   }


  //add promt for data here if yes continue, else go back to change the email

  //hvis nei hopp en funksjon tilbake start prosess på nytt

}
//***********************************
//send empty text and jump to the next functions

async function send_empty_message(sender_psid, user, message, custom_field_name, quick_reply_obj, in_message , bool_obj, jump_to ,err_message) {
  let string = msg;
  let response = {text:msg};

  if(custom_field_name !== null) {
    let custom_field = user.custom_data.filter(item => item.field_name === custom_field_name)

   response = {text:msg.replace("{<custom_field>}", custom_field[0].field_value)};
   await callSendAPI(sender_psid, response, "RESPONSE")

   if(jump_to !== null) {

    return {status:true,jump_to:jump_to.link};

  } else {

    return {status:true,step:"next"};
  }

  }  else {

    console.log(response);

    await callSendAPI(sender_psid, response,"RESPONSE");

    if(jump_to !== null) {

      return {status:true,jump_to:jump_to.link};

    } else {

      return {status:true,step:"next"};
    }
  }









  //send message send message move to next step in prosess
  //message pause is wait for user input

}

//**********************************************
//send send_quick_reply to colect data fex email, subscription data etc

//quick reply can være innebygd i empty text funksjonen f.eks med et ektra the_user_object

async function send_quick_reply(sender_psid, user, message, custom_field_name, quick_reply_obj, in_message , bool_obj, jump_to ,err_message) {

  console.log("send quick reply");

    //lag en foreach lopp som går gjennom alle quickreply object og bygger objektet for hver enkelt innlegg.......

    let quickreply_response = []

    await quick_reply_obj.forEach((item, _i) => {
      let temp_obj = {content_type : item.content_type ,payload:item.payload ,title:item.title};
      if(item.img) temp_obj.img = item.img;

      quickreply_response.push(temp_obj);
      });
    console.log({quick_reply_response : quickreply_response});


    let response = { text:msg,quick_replies:quickreply_response};

    let messaging_type = "RESPONSE";


    await callSendAPI(sender_psid,response,messaging_type);

    return {status:true,step:"pause"};
};


//***********************************************
//function to wait for data from the user validate it and store it in the object appropriat field

async function listen_for_data(sender_psid, user, message, custom_field_name, quick_reply_obj, in_message , bool_obj, jump_to ,err_message) {
  console.log(" listen for data ");



    if (custom_field_name === "email") {
      console.log("get_email");
      //get email from the user


      let promt_for_email = incoming_msg.text;


       //regex to check for email
       const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

       if (re.test(promt_for_email)) {

         console.log("this is a valid email " + promt_for_email );

         let data = user;


         let custom_field_index = await return_index( data ,custom_field_name, incoming_msg);



        console.log({"custom field index ": custom_field_index});

         if(custom_field_index !== false) {

           console.log("updating " + custom_field_name + " from " + data.custom_data[custom_field_index].field_value + " to " + promt_for_email );
           data.custom_data[custom_field_index].field_value = promt_for_email;
           console.log(data);

           try {
           //write update to database
           await addandupdate_userfields.add_or_update_custom_data(sender_psid, data, {field_name:custom_field_name,field_value: promt_for_email})
           //fs.writeFileSync('the_user_object.json',JSON.stringify(data))
         } catch(e) {
           console.error(e.message);
         }
         } else {

           //create new custom field
           data.custom_data.push({"field_name":custom_field_name,"field_value":promt_for_email});
           console.log(data);
           try {
           await addandupdate_userfields.add_or_update_custom_data(sender_psid, data, {field_name:custom_field_name,field_value: promt_for_email});
         } catch(e) {
           console.error(e.message);
         }
        }

         return {status:true,step:"next"};
       } else {

         console.log("this is not a valid email");

         let response = {text:err_message.msg}

         await callSendAPI(sender_psid,response,"RESPONSE");


         return {status:true,step:"jump_to",link:err_message.link};


        }



    } else {
      let data = user
      let promt_for_data = incoming_msg.text;

      console.log(promt_for_data)
      //check if field already exists return index if value exixts in obj, else return null
      let custom_field_index = await return_index(user,custom_field_name);

      if (!custom_field_index) {
        console.log("no value found, adding "+ promt_for_data + "  to db");

        data.custom_data.push({"field_name" : custom_field_name,"field_value" : promt_for_data });
         await addandupdate_userfields.add_or_update_custom_data(sender_psid, data, {field_name:custom_field_name,field_value: promt_for_data});


      } else {

        console.log(custom_field_name+" found " + "updating field with data " + promt_for_data);

        //legg in data integration her
        data.custom_data[custom_field_index].field_value = promt_for_data;
          await addandupdate_userfields.add_or_update_custom_data(sender_psid, data, {field_name:custom_field_name,field_value: promt_for_data});

      }


      console.log("get custom data " + custom_field_name);




      return {status:true,step:"next"};
   }



}
//************************************************
// show the user the dots to show writing_action specify lengt in seconds?
async function writing_action (sender_psid, user, message, custom_field_name, quick_reply_obj, in_message , bool_obj, jump_to ,err_message) {



  await sleep(3000);
  return {status:true,step:"next"};
}




//***************************************************
// functions to be exported

module.exports = {
  ask_for_custom_data:ask_for_custom_data,
  send_empty_message:send_empty_message,
  send_quick_reply:send_quick_reply,
  listen_for_data:listen_for_data,
  writing_action:writing_action,
  listen_for_quick_reply:listen_for_quick_reply,
  add_bool_custom_value:add_bool_custom_value,
  read_bool_value_of_custom_field:read_bool_value_of_custom_field
};


//***************************************
//helper functions

//function to find index of custom field in object //is it possible to use the bulit in array.filter() insted????
async function return_index(user, custom_field_name) {

let custom_field_index = false;

 await user.custom_data.forEach(async (item, i) => {
   console.log("looking in "+item.field_name)
   if (item.field_name === custom_field_name) {
     console.log("found one : " + item.field_value + " item number :" + i)
     custom_field_index =  i;
   }
 });
return custom_field_index;
}


//****************************************
//dev function to get input
function askforData (query) {
  this.query = query;

  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise( resolve => rl.question( this.query, ans => {
    rl.close();
    resolve(ans)
  } )
  )
}
