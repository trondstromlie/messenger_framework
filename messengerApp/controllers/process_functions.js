"use strict";

const sleep = require('sleep-promise');
const callSendAPI = require('./callSendAPI');







//**************************************************************
//send a string of text, include a quick reply object to add a quick reply

async function get_text_innput (sender_psid, user, msg, custom_field_name ,quick_reply_obj ,incoming_msg, err_message) {

  console.log("get text input");


  return {status:true,step:"next"};

  // Send message and start the next sequence


}
//***********
//function som viser en input data , sender quick reply for å bekrefte
//du skrev dette er de riktig.
async function listen_for_quick_reply(sender_psid, user, msg, custom_field_name ,quick_reply_obj ,incoming_msg, err_message) {

  console.log("confirm_data");


  let promt_for_answer = incoming_msg

  let answer = quick_reply_obj.filter( (item) => {

    return item.msg === promt_for_answer
  })


  if(answer.length > 0) {

     console.log(answer);

     return {status:true,step:"jump_to",link:answer[0].link};
   } else {
     console.log("dette svaret var ikke det jeg forventet :) bruk knappene over for å velge ditt svar ");
     return {status:true,step:"restart"};
   }


  //add promt for data here if yes continue else go back to change the email

  //hvis nei hopp en funksjon tilbake start prosess på nytt

}
//***********************************
//send empty text and jump to the next functions

async function send_empty_message(sender_psid, user, msg, custom_field_name ,quick_reply_obj ,incoming_msg, err_message) {
  let string = msg;
  const response = {text:msg};

  if(custom_field_name !== null) {
    let custom_field = user.custom_data.filter(item => item.field_name === custom_field_name)

   response = {text:msg.replace("{<custom_field>}", custom_field[0].field_value)};
   await callSendAPI(sender_psid, response, " RESPONSE")

   return {status:true,step:"next"};
  }
  else {

    console.log(response);

    await callSendAPI(sender_psid, response,"RESPONSE")

    return {status:true,step:"next"};
  }









  //send message send message move to next step in prosess
  //message pause is wait for user input

}

//**********************************************
//send send_quick_reply to colect data fex email, subscription data etc

//quick reply can være innebygd i empty text funksjonen f.eks med et ektra the_user_object

async function send_quick_reply(sender_psid, user, msg, custom_field_name ,quick_reply_obj, incoming_msg, err_message) {
  console.log("send quick reply");

    //lag en foreach lopp som går gjennom alle quickreply object og bygger objektet for hver enkelt innlegg.......

    let quickreply_response = []

    await quick_reply_obj.forEach((item, i) => {
      let temp_obj = {content_type : "user_email" ,payload:item.payload ,title:item.title};
      if(item.img) temp_obj.img = item.img;

      quickreply_response.push(temp_obj);
      });
    console.log(quickreply_response);


    let responce = { text:msg,quick_replies:quickreply_response};

    let messaging_type = "RESPONSE";


    callSendAPI(sender_psid,responce,messaging_type);

    return {status:true,step:"pause"};
};


//***********************************************
//function to wait for data from the user validate it and store it in the object appropriat field

async function listen_for_data(sender_psid, user, msg, custom_field_name ,quick_reply_obj, incoming_msg, err_message) {
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

           //write update to database
           //fs.writeFileSync('the_user_object.json',JSON.stringify(data))

         } else {
           //create new custom field
           data.custom_data.push({"field_name":custom_field_name,"field_value":promt_for_email});
           console.log(data);

           //fs.writeFileSync('the_user_object.json',JSON.stringify(data));


         }

         return {status:true,step:"next"};
       } else {

         console.log("this is not a valid email");

         let response = {text:err_message.msg}

         callSendAPI(sender_psid,response,"RESPONSE");


         return {status:true,step:"jump_to",link:err_message.link};

         //do something else!
               }



    } else {
      let data = user
      let promt_for_data = incoming_msg;
      console.log(promt_for_data)
      //check if field already exists return index if value exixts in obj, else return null
      let custom_field_index = await return_index(user,custom_field_name);
      if (!custom_field_index) {
        console.log("no value found, adding "+ promt_for_data + "  to db");

        data.custom_fields.push({"field_name" : custom_field_name,"field_value" : promt_for_data });

        console.log(data);
        fs.writeFileSync('the_user_object.json',JSON.stringify(data));
      } else {

        console.log(custom_field_name+" found " + "updating field with data " + promt_for_data);

        data.custom_fields[custom_field_index].field_value = promt_for_data;
        fs.writeFileSync('the_user_object.json',JSON.stringify(data));
      }


      console.log("get custom data " + custom_field_name);

      if( return_index)


      return {status:true,step:"next"};
   }



}
//************************************************
// show the user the dots to show writing_action specify lengt in seconds?
async function writing_action (sender_psid, user, msg, custom_field_name , quick_reply_obj, incoming_msg) {



  await sleep(3000);
  return {status:true,step:"next"};
}




//***************************************************
// functions to be exported

module.exports = {
  get_text_innput:get_text_innput,
  send_empty_message:send_empty_message,
  send_quick_reply:send_quick_reply,
  listen_for_data:listen_for_data,
  writing_action:writing_action,
  listen_for_quick_reply:listen_for_quick_reply
};


//***************************************
//heper functions

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
