"use strict";

const sleep = require('sleep-promise');
const callSendAPI = require('./callSendAPI');
const addandupdate_userfields = require('./addandupdate_userfields');
const senderAction = require('./senderAction');

//************************************************************************ */
//** a function to fetch data from an api and show the data in a generic template */
//** the object must contain an image some descriptive text, and can contain a webadress ?  */

async function fetch_generic_template(sender_psid, user, message, custom_field_obj, quick_reply_obj, in_message , bool_obj, jump_to ,err_message, pause) {

  let buttons = [
    {"title" : "les mer", "value" : "url", "type" : "web_url", },
    {"title":"Bestill" ,"type": "postback", "value": { "payload":{"messenger_process":"Pizza","pris":"price","vare":"vare","tittle":"title"}}}
  ]

 //create a default object for testing if no api object is available fall back to the test object

 let default_obj = [
  {
    img_url:"https://brands-a.prod.onewp.net/app/uploads/sites/4/2018/09/Pizza-med-kj%C3%B8ttdeig.jpg",
    title:"Deilig piza med kjøttdeig",
    sub_title:"Smelter på tunga",
    price:"150",
    in_stock:"5",
    item_number:"123",
    url:"https://www.morshjemmebakte.no/recipes/pizza-med-kjottdeig/"
 
  },
  {
    img_url:"https://i0.wp.com/detgladekjokken.no/wp-content/uploads/2020/02/Pizza-med-kylling.jpg",
    title:"Pizza med kylling",
    sub_title:"kvakkende god",
    price:"200",
    in_stock:"1",
    item_number:"456",
    url:"https://detgladekjokken.no/oppskrift/pizza-med-marinert-kylling/",

  },

  {
    img_url:"https://res.cloudinary.com/norgesgruppen/image/upload/c_fill,f_auto,g_center,h_500,q_auto:eco,w_1135/y7u4ve9fzponeyju7jqh.jpg",
    title:"pizza med pinnekjøtt",
    sub_title:"salt, røkt og frisk",
    price:"300",
    in_stock:"15",
    item_number:"789",
    url:"https://kiwi.no/oppskrifter/kjott/pinnekjott-oppskrifter/pizza-med-pinnekjott/",
  },

];


//now we start building the object 
let new_element = [];
default_obj.forEach( ( item , i ) => {

  let element = {};
  
 

  if(item.img_url) element.image_url = item.img_url;
  if(item.title) element.title = item.title;
  if(item.sub_title) element.subtitle = item.sub_title;
  if(item.price) element.subtitle += "\nPris : " + item.price;
  if(item.in_stock) element.subtitle += "\nPå lager : " + item.in_stock;
  if(item.url) {

    element.default_action = {};
    element.default_action.type = "web_url";
    element.default_action.url = item.url;
    element.default_action.messenger_extensions = "FALSE";
    element.default_action.webview_height_ratio ="TALL";

  };

  
  //if this template has buttons add them to the object here.
  if(buttons.length > 0) {

    element.buttons = [];

    //we use a function in the frontend to map data from the api to buttens f.ex les mer = web_view, bestill = postback with data from object. 
    //type = postback or web_url, pages whitelisted by page can open in the messenger window.
    //creat a function that download the data then let you tell what buttons should do what.

    //when a button is clicked a postback with a payload as a stringifyed json is sent to the postback function
    

    buttons.forEach( (button_item, i ) => {

      if(button_item.type === "web_url") {
       let button_obj = { title: button_item.title , url: item.url , type:button_item.type  };
       element.buttons.push(button_obj);
       
      } 
      else if (button_item.type === "postback") {
        
        // the postback should always be an objekt containing the name of the function that sends it. to route the right responce from the 
        // postback function, the only exeption is the get startetd persistent menu....

        //first add the standard fields to the button object.

        let button_obj = {title: button_item.title, type:button_item.type }

        //now add the the payload 

        let payload = button_item.value.payload;

        button_obj.payload = JSON.stringify(payload);
        
        element.buttons.push(button_obj);
        

      };

    });

  }
new_element.push(element);
});


//send the responce object 
let response = {attachment:{type:"template", payload:{template_type:"generic", elements:new_element }}};
console.log({"responce_element": response})

 await callSendAPI(sender_psid , response, "RESPONSE");
 return {status:true,step:"pause"};
} // end of generic template

// the next function shoud be a "wait for data function" acepting the calback and putting it in the right customfield as an arry.
// then ask if customer want to shop for more food products order drinks or go to checkout. 
// on check-out show a list of all the thins in the object and a total price. 

//for now click ok ask for email and send reciept on email. 

//********************************************************************* */
//** listen for add to cart postback */

async function listen_for_add_to_cart (sender_psid, user, message, custom_field_obj, quick_reply_obj, in_message , bool_obj, jump_to ,err_message, pause) {

 try {
  
  if(!in_message.payload) {

    console.log("no payload detected");
    return {status:false,step:"pause"};

  }

  let postback = JSON.parse(in_message.payload);


 //du glemmer at customdata er en array du må bruke filter for å finne det riktige feltet.

  let order_field = user.custom_data.filter( item => item.name === custom_field_obj.name ); 

  //if order field is == 0 add a field 
  
  if( ! order_field.length > 0 ) {
    
   cnsole.log("*****************   no field found *******************");
   console.log({order_field_listen_for_cart: order_field});
 
   //init empty aray
   let cart = [];

   cart.push(postback);

   order_field = [{field_name:custom_field_obj.name , field_value: JSON.stringify(cart) }];

   await addandupdate_userfields.add_or_update_custom_data(sender_psid, user , order_field[0]);

   return {status:true,step:"next"};

  } else {

    //if a custom field is found add to the array 
    console.log("*******************  field found **********************");
    let cart = JSON.parse(order_field[0].value);
    console.log({the_cart_pre_push:cart})
  
    cart.push(postback);
    console.log({the_cart:cart});
  
    await addandupdate_userfields.add_or_update_custom_data(sender_psid, user , {field_name:custom_field_obj.name ,field_value:JSON.stringify(cart)});
  
    return {status:true,step:"next"};

 

  }
} catch (e) {

  console.error(e.message);

 }
};



//********************************************************************* */
//** invisible function to read value of bool custom value */
//** if value is true do someting if value is false do something else  */

async function read_bool_value_of_custom_field (sender_psid, user, message, custom_field_obj, quick_reply_obj, in_message , bool_obj, jump_to ,err_message, pause) {

  try {

    //first check if there is a userfield with this name in the db 
    let user_field = user.custom_data.filter(item => item.field_name === custom_field_obj.name);
    console.log({fond_user_field:user_field});

    if( ! user_field.length > 0 )  {
      //no field found
      console.log(" could not find the field " + custom_field_obj.name );
      let message = bool_obj.is_false.msg;
        await callSendAPI(sender_psid,{text:message})
        return {status:true,step:"jump_to",link:bool_obj.is_false.link};

    } else {
      //field found
      let condition = user_field[0].field_value === bool_obj.test;
      console.log("matchin values " + user_field[0].field_value + " === " + bool_obj.test + " = " + condition );

      //retrun a value jump to a index in the process if the result is true or false...

      if(condition === true) {
        console.log("fant verdien");

        let message = bool_obj.is_true.msg;
        await callSendAPI(sender_psid,{text:message})
        return {status:true,step:"jump_to",link:bool_obj.is_true.link};
      } else {

        console.log("fant ikke verdien")
        let message = bool_obj.is_false.msg;
        await callSendAPI(sender_psid,{text:message})
        return {status:true,step:"jump_to",link:bool_obj.is_false.link};
        
      }

    }
  } catch (e) {

    console.error(e.message);
  }
}


//*********************************************************************
//** invisible function to add a custom field with a value 
//** f.ex subscription data subscribing to field -- newsletter:true */

async function add_bool_custom_value(sender_psid, user, message, custom_field_obj, quick_reply_obj, in_message , bool_obj, jump_to ,err_message, pause) {

  try {

    await addandupdate_userfields.add_or_update_custom_data(sender_psid, null , {field_name:custom_field_obj.name ,field_value:custom_field_obj.value});

    return {status:true,step:"next"}

  } catch (e) {

    console.log(e.message);
  }
  
  

};

//*********************************************************************** */
//******function Jump to process

async function jump_to_process(sender_psid, user, message, custom_field_obj, quick_reply_obj, in_message , bool_obj, jump_to ,err_message, pause) {

  console.log("******* jump to process " + jump_to.process_link);

// jump to a process name,
// search for process index in messenger processes 
// add the prcesses object in the refrence to make it searchable
// a user cllicks yes on a quickreply and are then sendt to this function 


  try {

    if(message !== null) {
      let response = {text:message};
      await callSendAPI(sender_psid,response,"RESPONSE");
    }
  
    return {status:true,step:"start_new_process",link:jump_to.process_link}

  } catch(e) {

    console.error(e.message);
  }


  
}


//**************************************************************
//send a string of text, include a quick reply object to add a quick reply

async function ask_for_custom_data (sender_psid, user, message, custom_field_obj, quick_reply_obj, in_message , bool_obj, jump_to ,err_message, pause) {

  console.log("Ask for custom data and pause");

  let string = message;
  let response = {text:message};

  if(custom_field_obj !== null) {
    let custom_field = user.custom_data.filter(item => item.field_name === custom_field.obj.name)

   response = {text:messsage.replace("{<custom_field>}", custom_field[0].field_value)};
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

async function listen_for_quick_reply(sender_psid, user, message, custom_field_obj, quick_reply_obj, in_message , bool_obj, jump_to ,err_message, pause) {

  console.log("Listen for quick_replies confirm_data");


  let prompt_for_answer = in_message.text;
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
     return {status:true,step:"pause"};
   }


  //add promt for data here if yes continue, else go back to change the email

  //hvis nei hopp en funksjon tilbake start prosess på nytt

}
//***********************************
//send empty text and jump to the next functions

//todo lag en bedre funksjon for å fylle inn custom fields.
//f.eks navn epost, etc så du kan ha flere customfields i samme text.
//regex for å finne innholdet av merger fields {<merger-fields>}

async function send_empty_message(sender_psid, user, message, custom_field_obj, quick_reply_obj, in_message , bool_obj, jump_to ,err_message, pause) {
  
  let string = message;
  let response = {text:message};

  if(custom_field_obj !== null) {
    console.log({custom_field_obj:custom_field_obj.name});
    
    let custom_field = user.custom_data.filter(item => item.field_name === custom_field_obj.name)
    console.log(custom_field)

   response = {text:message.replace("{<custom_field>}", custom_field[0].field_value)};
   await callSendAPI(sender_psid, response, "RESPONSE")

   if(jump_to !== null) {

    return {status:true,step:"jump_to",link:jump_to.link};

  } else {

    return {status:true,step:"next"};
  }

  }  else {

    console.log(response);

    await callSendAPI(sender_psid, response,"RESPONSE");

    if(jump_to !== null) {

      return {status:true,step:"jump_to",link:jump_to.link};

    } else {

      return {status:true,step:"next"};
    }
  }

  //send message send message move to next step in prosess
  //message pause is wait for user input

}


//**********************************************
//send send_quick_reply to colect data f.ex email, subscription data etc

//quick reply can være innebygd i empty text funksjonen f.eks med et ektra the_user_object

async function send_quick_reply(sender_psid, user, message, custom_field_obj, quick_reply_obj, in_message , bool_obj, jump_to ,err_message, pause) {

  console.log("send quick reply");

    //lag en foreach lopp som går gjennom alle quickreply object og bygger objektet for hver enkelt innlegg.......

    let quickreply_response = []

    await quick_reply_obj.forEach((item, _i) => {
      let temp_obj = {content_type : item.content_type ,payload:item.payload ,title:item.title};
      if(item.img) temp_obj.img = item.img;

      quickreply_response.push(temp_obj);
      });
    console.log({quick_reply_response : quickreply_response});


    let response = { text:message,quick_replies:quickreply_response};

    let messaging_type = "RESPONSE";


    await callSendAPI(sender_psid,response,messaging_type);

    return {status:true,step:"pause"};
};


//***********************************************
//function to wait for data from the user validate it and store it in the object appropriat field

async function listen_for_data(sender_psid, user, message, custom_field_obj, quick_reply_obj, in_message , bool_obj, jump_to ,err_message, pause) {
  console.log(" listen for data ");



    if (custom_field_obj.name === "email") {
      console.log("get_email");
      //get email from the user


      let promt_for_email = in_message.text;


       //regex to check for email
       const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

       if (re.test(promt_for_email)) {

         console.log("this is a valid email " + promt_for_email );

         let data = user;


         let custom_field_index = await return_index( data ,custom_field_obj.name, in_message);



        console.log({"custom field index ": custom_field_index});

         if(custom_field_index !== false) {

           console.log("updating " + custom_field_obj.name + " from " + data.custom_data[custom_field_index].field_value + " to " + promt_for_email );
           data.custom_data[custom_field_index].field_value = promt_for_email;
           console.log(data);

           try {
           //write update to database
           await addandupdate_userfields.add_or_update_custom_data(sender_psid, data, {field_name:custom_field_obj.name,field_value: promt_for_email})
           //fs.writeFileSync('the_user_object.json',JSON.stringify(data))
         } catch(e) {
           console.error(e.message);
         }
         } else {

           //create new custom field
           data.custom_data.push({"field_name":custom_field_obj.name,"field_value":promt_for_email});
           console.log(data);
           try {
           await addandupdate_userfields.add_or_update_custom_data(sender_psid, data, {field_name:custom_field_obj.name,field_value: promt_for_email});
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
      let promt_for_data = in_message.text;

      console.log(promt_for_data)
      //check if field already exists return index if value exixts in obj, else return null
      let custom_field_index = await return_index(user,custom_field_obj.name);

      if (!custom_field_index) {
        console.log("no value found, adding "+ promt_for_data + "  to db");

        data.custom_data.push({"field_name" : custom_field_obj.name,"field_value" : promt_for_data });
         await addandupdate_userfields.add_or_update_custom_data(sender_psid, data, {field_name:custom_field_obj.name,field_value: promt_for_data});


      } else {

        console.log(custom_field_obj.name+" found " + "updating field with data " + promt_for_data);

        //legg in data integration her
        data.custom_data[custom_field_index].field_value = promt_for_data;
          await addandupdate_userfields.add_or_update_custom_data(sender_psid, data, {field_name:custom_field_obj.name,field_value: promt_for_data});

      }


      console.log("get custom data " + custom_field_obj.name);




      return {status:true,step:"next"};
   }



}
//************************************************
// show the user the dots to show writing_action specify lengt in seconds?

async function writing_action (sender_psid, user, message, custom_field_obj, quick_reply_obj, in_message , bool_obj, jump_to ,err_message, pause) {

try {

  let action_start = await senderAction(sender_psid, "typing_on");

  console.log(action_start);

  let defaulut_sleep = 1;
  let sleep_for = null;

  if (pause === null) {
    sleep_for = +defaulut_sleep;
  } else {
    sleep_for = +pause;
  }

  await sleep(sleep_for * 1000);

  let action_stop = await senderAction(sender_psid, "typing_off");

  return {status:true,step:"next"};

} catch(err) {
  console.error(err.message);
}

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
  read_bool_value_of_custom_field:read_bool_value_of_custom_field,
  jump_to_process:jump_to_process,
  fetch_generic_template:fetch_generic_template,
  listen_for_add_to_cart:listen_for_add_to_cart
};


//***************************************
//helper functions

//function to find index of custom field in object //is it possible to use the bulit in array.filter() insted????

async function return_index(user, custom_field_obj) {

let custom_field_index = false;

 await user.custom_data.forEach(async (item, i) => {
   console.log("looking in "+item.field_name)
   if (item.field_name === custom_field_obj) {
     console.log("found one : " + item.field_value + " item number :" + i)
     custom_field_index =  i;
   }
 });
return custom_field_index;
}
