"use strict";
const readline = require('readline');
const fs = require('fs');
const sleep = require('sleep-promise');







//**************************************************************
//send a string of text, include a quick reply object to add a quick reply

async function get_text_innput (sender_psid, user, msg, custom_field_name ,quick_reply_obj) {
  console.log("get text input");


  return {status:true,step:"next"};

  // Send message and start the next sequence


}
//***********
//function som hviser en input data , sender quick reply for å bekrefte
//du skrev dette er de riktig.
async function listen_for_quick_reply(sender_psid, user, msg, custom_field_name ,quick_reply_obj ) {

  console.log("confirm_data");


     //console.log("looking in " + item.field_name + " " + item.field_value )


  let promt_for_answer = await new askforData(msg);

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

async function send_empty_message(sender_psid, user, msg, custom_field_name ,quick_reply_obj ) {
  let string = msg;

  if(custom_field_name !== null) {
    let custom_field = user.custom_fields.filter(item => item.field_name === custom_field_name)

    string = msg.replace("{<custom_field>}", custom_field[0].field_value);
  }

  console.log(string);






  return {status:true,step:"pause"};
  //send message send message move to next step in prosess
  //message pause is wait for user input

}

//**********************************************
//send send_quick_reply to colect data fex email, subscription data etc
//quick reply can være innebygd i empty text funksjonen f.eks med et ektra the_user_object
async function send_quick_reply(sender_psid, user, msg, custom_field_name ,quick_reply_obj) {
  console.log("send quick reply");
  console.log(quick_reply_obj);
    return {status:true,step:"next"};
};


//***********************************************
//function to wait for data from the user validate it and store it in the object appropriat field
async function listen_for_data(sender_psid, user, msg, custom_field_name ,quick_reply_obj) {
  console.log(" listen for data ");



    if (custom_field_name === "email") {
      console.log("get_email");
      //get email from the user


      let promt_for_email = await new askforData(msg);


       //regex to check for email
       const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

       if (re.test(promt_for_email)) {

         console.log("this is a valid email " + promt_for_email );

         let data = user;


         let custom_field_index = await return_index(user,custom_field_name);



        console.log({"custom field index ": custom_field_index});

         if(custom_field_index !== false) {

           console.log("updating " + custom_field_name + " from " + data.custom_fields[custom_field_index].field_value + " to " + promt_for_email );
           data.custom_fields[custom_field_index].field_value = promt_for_email;
           console.log(data);
           fs.writeFileSync('the_user_object.json',JSON.stringify(data))

         } else {

           data.custom_fields.push({"field_name":custom_field_name,"field_value":promt_for_email});
           console.log(data);
           fs.writeFileSync('the_user_object.json',JSON.stringify(data));


         }

         return {status:true,step:"next"};
       } else {

         console.log("this is not a valid email");

         return {status:true,step:"pause"};

         //do something else!
               }



    } else {
      let data = user
      let promt_for_data = await new askforData(msg);
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
async function writing_action (sender_psid, user, msg, custom_field_name ,quick_reply_obj) {


  console.log("writing action sleeping for 1 sec");
  await sleep(1000);
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

await user.custom_fields.forEach(async (item, i) => {
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