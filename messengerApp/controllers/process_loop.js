//************************************************
// todo
//
//
// sett all functions to return pause


"use strict";
const process_functions = require('./process_functions');
const addandupdate_userfields = require('./addandupdate_userfields');
const fs = require('fs');
const { getMaxListeners } = require('process');
const { add_or_update_custom_data } = require('./addandupdate_userfields');

//the process_loop functions
//starts when handle message discovers an active userProcess in the user procecces field.
//or when a postback with a payload is discoveres or a ref link 
//index is the index of the userprocess in case there is more than one.
//only one user process can be activ in one time. creata array.map() that sets all other procecces to false whan creating a new process



async function user_loop ( process_name , user_obj, index , incoming_msg ) {

  console.log(" *********************  process loop is starting!  ********************************");

  let user = user_obj;
  let step = user.messenger_processes[index].process_progress;
  let processName = process_name;
  let sender_psid = user.sender_psid;

  //the user processes will be imprteted from a registerd users db in the future
  //**************************************************************

  
  const user_process = {processes: [
    {
      name:"Getting_started",
      steps: [
        {name:"writing_action",func:process_functions.writing_action},
        {name:"send_empty_message",func:process_functions.send_empty_message ,msg:"Hei "+ user.first_name +" Så hyggelig at du vil snakke med meg, hva kan jeg hjelpe deg med i dag? :) "},
        {name:"start_menu",func:process_functions.generic_template, generic_template_obj:{type:"buttons", name:"welcome"}},
        {name:"writing_action2",func:process_functions.writing_action,pause:5},
      ]
    },
    {
      name:"Reminder",
      steps:[
        {name:"send_empty_message",func:process_functions.send_empty_message ,msg:"Hei "+ user.first_name +" jeg sender deg til en liten meldfing nå <3 :) "},
        {name:"writing_action2",func:process_functions.writing_action,pause:1}
        
      ]
    },
    {
      name:"Generic_menu",
      steps: [
        {name:"writing_action",func:process_functions.writing_action},
        {name:"send_empty_message",func:process_functions.send_empty_message ,msg:"Hei "+ user.first_name +" Så hyggelig at du vil snakke med meg, hva kan jeg hjelpe deg med i dag? :) "},
        {name:"start_menu",func:process_functions.generic_template, generic_template_obj:{type:"generic_template", name:"welcome"}},
        {name:"writing_action2",func:process_functions.writing_action,pause:5},
      ]
    },
    {
      name:"Generic_image",
      steps: [
        {name:"writing_action",func:process_functions.writing_action},
        {name:"send_empty_message",func:process_functions.send_empty_message ,msg:"Hei "+ user.first_name +" Så hyggelig at du vil snakke med meg, hva kan jeg hjelpe deg med i dag? :) "},
        {name:"start_menu",func:process_functions.generic_template, generic_template_obj:{type:"media", name:"welcome"}},
        {name:"writing_action2",func:process_functions.writing_action,pause:5},
      ]
    },
    {
      name:"Receipt",
      steps: [
        {name:"writing_action",func:process_functions.writing_action},
        {name:"send_empty_message",func:process_functions.send_empty_message ,msg:"Hei "+ user.first_name +" Her er din kvittiering :) "},
        {name:"start_menu",func:process_functions.generic_template, generic_template_obj:{type:"receipt", name:"welcome"}},
        {name:"writing_action2",func:process_functions.writing_action,pause:1},
      ]
    },
    {
     name:"Get_personal",
     steps: [

         {name:"send_empty_message",func:process_functions.send_empty_message ,msg:"Hei "+ user.first_name +" før du kan registrer deg må jeg få vite litt mer om hvem du er :) "},
         {name:"writing_action",func:process_functions.writing_action},
         {name:"ask for email",func:process_functions.send_empty_message, msg:"Skriv din beste epostadresse her, eller velg adressen facebook har foreslått for deg. " },
         {name:"ask for email quick reply",func:process_functions.send_quick_reply,msg:"velg her!",quick_reply_obj:[{"content_type":"user_email","title":"email","payload":"email"}]},
         {name:"listen_for_email",func:process_functions.listen_for_data,custom_field_obj:{name:"email"},msg:" venter på epost >> ",err_message:{msg:"Dette er ikke en gyldig epost adresse, prøv igjen! :) ", link:2} },
         {name:"confirm_email_text",func:process_functions.send_empty_message,custom_field_obj:{name:"email"}, msg:"Du skrev {<custom_field>} bekreft med knappen under at det er riktig "},
         {name:"confirm email",func:process_functions.send_quick_reply,msg:"Velg her",quick_reply_obj:[{"content_type":"text","title":"Ja","payload":"send takk",link:8},{"content_type":"text","title":"Nei","payload":"ask for email",link:2}]},
         {name:"listen_for_email",func:process_functions.listen_for_quick_reply,custom_field_obj:{name:"email"}, msg:"Skriv ja eller nei >> " , quick_reply_obj:[{"content_type":"text","title":"Ja","payload":"send takk",link:8},{"content_type":"text","title":"Nei","payload":"ask for email",link:2}]},
         {name:"send takk",func:process_functions.send_empty_message, msg : "Takk :) " },
         {name:"writing_action",func:process_functions.writing_action},
         {name:"get_mothers_name",func:process_functions.send_empty_message, msg:"Nå må jeg vite litt om din fammilie :) "},
         {name:"ask_for_mor",func:process_functions.ask_for_custom_data, msg:"skriv navnet på moren din under ! "},
         {name:"listen_for_mor",func:process_functions.listen_for_data,custom_field_obj:{name:"mor"},msg:" venter på custom field mor >> ",err_message:{msg:"Dette er var ikke dataen jeg forventet ", link:17} },
         {name:"confirm_data_mor",func:process_functions.send_empty_message,custom_field_obj:{name:"mor"}, msg:"Du skrev {<custom_field>} bekreft med knappen under at det er riktig "  },
         {name:"confirm mor",func:process_functions.send_quick_reply,msg:"velg Ja eller Nei",quick_reply_obj:[{"content_type":"text","title":"Ja","payload":"send to bio",link:16},{"content_type":"text","title":"Nei","payload":"ask for bio",link:17}]},
         {name:"listen_for_mor",func:process_functions.listen_for_quick_reply,custom_field_obj:{name:"mor"}, msg:"Skriv ja eller nei " , quick_reply_obj:[{"content_type":"text","title":"Ja","payload":"send to bio",link:16},{"content_type":"text","title":"Nei","payload":"ask for bio",link:17}]},
         {name:"writing_action",func:process_functions.writing_action},
         {name:"get_bio",func:process_functions.send_empty_message, msg:"Nå må jeg vite litt om deg :) "},
         {name:"ask_for_bio",func:process_functions.ask_for_custom_data, msg:"Skriv din bio her vær kreativ  "},
         {name:"listen_for_bio",func:process_functions.listen_for_data,custom_field_obj:{name:"bio"},msg:" venter på custom field bio >> ",err_message:{msg:"Dette er var ikke dataen jeg forventet ", link:9} },
         {name:"confirm_data_mor",func:process_functions.send_empty_message,custom_field_obj:{name:"bio"}, msg:"Du skrev {<custom_field>} bekreft med knappen under at det er riktig "  },
         {name:"confirm mor",func:process_functions.send_quick_reply,msg:"velg Ja eller Nei",quick_reply_obj:[{"content_type":"text","title":"Ja","payload":"send to fin",link:23},{"content_type":"text","title":"Nei","payload":"ask for mother",link:10}]},
         {name:"listen_for_mor",func:process_functions.listen_for_quick_reply,custom_field_obj:{name:"bio"}, msg:"Skriv ja eller nei " , quick_reply_obj:[{"content_type":"text","title":"Ja","payload":"send to bio",link:23},{"content_type":"text","title":"Nei","payload":"ask for mother",link:10}]},
         {name:"writing_action",func:process_functions.writing_action},
         {name:"send_empty_message",func:process_functions.send_empty_message, msg: "Takk du er nå registrert "}
        ] },
    {

      name:"Pause",
      steps: [
         {name:"add_update_custom_field",func:process_functions.add_bool_custom_value,custom_field_obj:{name:"subscribe",value:"true"}},
         {name:"send_cofirmation",func:process_functions.send_empty_message,msg:"ok du abonerer på dette kurset nå :) "},
         {name:"get_email",func:process_functions.send_empty_message, msg:"Hei " + user.first_name + " jeg skal sende deg en melding om en time "},
         {name:"send_to_crontab", func:process_functions.send_to_cron, cron_obj : {page_id: "104680997936481" ,timestamp:null, messenger_process: "Reminder", field_name:"subscribe", field_value:"true", minutes:15, houres:0} },
         {name:"writing_action",func:process_functions.writing_action, pause:1},

      ]
    },
    {

      name:"Confirm_start",
      steps: [
        {name:"writing_action",func:process_functions.writing_action},
        {name:"send_empty_message",func:process_functions.send_empty_message, msg: "Hyggelig å se deg " + user.first_name},
        {name:"writing_action",func:process_functions.writing_action},
        {name:"check if custom_field is true",func:process_functions.read_bool_value_of_custom_field,custom_field_obj:{name:"email"},bool_obj:{test:"mybestlabs@gmail.com",is_true:{link:4,msg:"herlig, fant denne epostadressen "},is_false:{link:7,msg:"oops fant ikke noe her"}} },
        {name:"send_empty_message",func:process_functions.send_empty_message, msg: "okay supert",jump_to:{link:7}},
        {name:"writing_action",func:process_functions.writing_action},
        {name:"send_empty_message",func:process_functions.send_empty_message, msg: "det var ikke noe der", jump_to:{link:7}},
        {name:"send_empty_message",func:process_functions.send_empty_message, msg: "takk for din tålmodighet avslutter prosessen nå"}
        

      ]
    },
  {
    name: "Add_customfield",
    steps: [
      {name:"add_update_custom_field",func:process_functions.add_bool_custom_value,custom_field_obj:{name:"test_subscriber",value:"true"}},
      {name:"send_cofirmation",func:process_functions.send_empty_message,msg:"ok du abonerer på dette kurset nå :) "},
      {name:"jump to function confirm_start", func:process_functions.jump_to_process,jump_to:{process_link:"Confirm_start"}},
      {name:"send_cofirmation",func:process_functions.send_empty_message,msg:"hopper til neste prosess :) "}
    ]
  },
  {
    name:"Type_action",
    steps:[
      {name:"send melding  ",func:process_functions.send_empty_message,msg:"ok nå skal jeg vente noen sekunder :) "},
      {name:"writing_action",func:process_functions.writing_action,pause:5},
      {name:"send_cofirmation",func:process_functions.send_empty_message,msg:"så kommer en melding før jeg venter igjen :) "},
      {name:"writing_action",func:process_functions.writing_action, pause:3},
      {name:"send_cofirmation",func:process_functions.send_empty_message,msg:"takk skal du ha nå avslutter jeg. :) "},
    ]
  },
  {
    name: "Pizza",
    steps:[
      {name:"writing_action",func:process_functions.writing_action,pause:5},
      {name:"send melding velkommen melding ",func:process_functions.send_empty_message,msg:"Ok " + user.first_name + " jeg henter menyen for deg :) "},
      {name:"hva vil du bestille",func:process_functions.send_quick_reply,msg:"Hva vill du bestille? Velg med knappene under! ",quick_reply_obj:[{"content_type":"text","title":"Mat","payload":"Bestill_mat",link:4},{"content_type":"text","title":"Drikke","payload":"bestill_drikke",link:5}]},
      {name:"listen_for_hva vil du bestille",func:process_functions.listen_for_quick_reply,custom_field_obj:{name:"bestilling"}, msg:"Skriv ja eller nei " , quick_reply_obj:[{"content_type":"text","title":"Mat","payload":"Bestill_mat",link:4},{"content_type":"text","title":"Drikke","payload":"bestill_drikke",link:5}]},
      {name:"jump to function Order_food", func:process_functions.jump_to_process,jump_to:{process_link:"Order_food"}},
      {name:"jump to function Order_drinks", func:process_functions.jump_to_process,jump_to:{process_link:"Order_drinks"}},
      {name:"writing_action",func:process_functions.writing_action,pause:1}
         
      
    ]
  },
  {
    name:"Order_food",
    steps:[
      {name:"writing_action",func:process_functions.writing_action,pause:5},
      {name:"pizza_meny",func:process_functions.fetch_generic_template, generic_template_obj:{name:"Order_food", url:"<url>",qs:"email"}},
      {name:"wait_for_postback", func:process_functions.listen_for_add_to_cart,custom_field_obj:{name:"order"}},
      {name:"writing_action2",func:process_functions.writing_action,pause:5},
      {name:"send melding bekreftelses melding ",func:process_functions.send_empty_message,msg:"Ok det er mottat :) "},
      {name:"writing_action",func:process_functions.writing_action,pause:1},
      {name:"jump to function see order", func:process_functions.jump_to_process,jump_to:{process_link:"See_order"}},
      {name:"writing_action",func:process_functions.writing_action,pause:1}
    ]
  },
  {
    name:"Order_drinks",
    steps:[
      {name:"writing_action",func:process_functions.writing_action,pause:5},
      {name:"drink_menu",func:process_functions.fetch_generic_template, generic_template_obj:{name:"Order_drinks", url:"<url>",qs:"email"}},
      {name:"wait_for_postback", func:process_functions.listen_for_add_to_cart,custom_field_obj:{name:"order"}},
      {name:"writing_action2",func:process_functions.writing_action,pause:5},
      {name:"send melding bekreftelses melding ",func:process_functions.send_empty_message,msg:"Ok det er mottat :) "},
      {name:"writing_action",func:process_functions.writing_action,pause:1},
      {name:"jump to function see order", func:process_functions.jump_to_process,jump_to:{process_link:"See_order"}},
      {name:"writing_action",func:process_functions.writing_action,pause:1}
    ]
  },
  {
    name:"Order_more",
    steps: [
      {name:"writing_action",func:process_functions.writing_action,pause:5},
    ]
  },
  {
    name:"See_order",
    steps: [
      {name:"show_order", func:process_functions.fetch_and_show_cart,custom_field_obj:{name:"order"}},
      {name:"writing_action",func:process_functions.writing_action,pause:5},
      {name:"send melding ",func:process_functions.send_empty_message,msg:"hva vill du gjøre nå " + user.first_name},
      {name:"bestille_mer_eller_go_to_cart",func:process_functions.send_quick_reply,msg:"Vill du bestille mer eller sende orderen til kjøkkenet? ",quick_reply_obj:[{"content_type":"text","title":"Bestille mer","payload":"til_kjøkken",link:5},{"content_type":"text","title":"Send til kjøkkenet","payload":"bestill_drikke",link:6}]},
      {name:"listen_for_hva vil du bestille",func:process_functions.listen_for_quick_reply,custom_field_obj:{name:"bestilling"}, msg:"velg med knappene under " , quick_reply_obj:[{"content_type":"text","title":"Bestille mer","payload":"til_kjøkken",link:5},{"content_type":"text","title":"Send til kjøkkenet","payload":"bestill_drikke",link:6}]},
      {name:"jump to function Order_drinks", func:process_functions.jump_to_process,jump_to:{process_link:"Pizza"}},
      {name:"kasse ",func:process_functions.send_empty_message,msg:"Suupert! :) Din ordre er sendt til kjøkkenet "},
      {name:"start_menu",func:process_functions.generic_template,custom_field_obj:{name:"order"}, generic_template_obj:{type:"receipt", name:"welcome"}},
      {name:"clean order field",func:process_functions.add_bool_custom_value,custom_field_obj:{name:"order",value:'[]'}}
    ]
  }
    ]
  }; //end of object ***************************************

//create a function to show the products in cart, then promt user for shop more or chekcout
//sheckout should open a new messenger extension window, where you can remove products from cart
//with a vips like payment 
//after payment show the reciept template.....




  //check if user process has steps if not abort prosess with error message
  let check_for_process = await user_process.processes.filter(item => item.name === processName);
  if(!check_for_process.length > 0) {
    console.log( processName + " does not exist deleting the messenger process" );
    addandupdate_userfields.delete_messenger_process(sender_psid, processName);
    return NaN;
  }

    user_process.processes.forEach(async (item, i) => {



      if(item.name === user.messenger_processes[index].process_name ) {
        try {

          console.log("\n\n********* starting " + item.steps[step].name +  " **********\n\n");

          let message = null;
          let custom_field_obj = null;
          let quick_reply_obj = null;
          let in_message = incoming_msg;
          let err_message = null;
          let bool_obj = null;
          let jump_to = null;
          let pause = null;
          let generic_template_obj = null;
          let webview_obj = null;
          let cron_obj = null;

          console.log(in_message);

          //check if some or all of the standarfields are set if set initialize else field is == null

          if( item.steps[step].msg ) message = item.steps[step].msg;

          if( item.steps[step].custom_field_obj ) custom_field_obj = item.steps[step].custom_field_obj ;

          if( item.steps[step].quick_reply_obj ) quick_reply_obj = item.steps[step].quick_reply_obj ;

          if( item.steps[step].err_message ) err_message = item.steps[step].err_message ;

          if( item.steps[step].bool_obj ) bool_obj = item.steps[step].bool_obj ;

          if (item.steps[step].jump_to ) jump_to = item.steps[step].jump_to ;

          if (item.steps[step].pause ) pause = item.steps[step].pause ;

          if (item.steps[step].generic_template_obj ) generic_template_obj = item.steps[step].generic_template_obj;

          if (item.steps[step].webview_obj) webview_obj = item.steps[step].webview_obj;

          if(item.steps[step].cron_obj) cron_obj = item.steps[step].cron_obj;


          let item_function = item.steps[step].func;



          let res = await item_function(user.sender_psid, user, message, custom_field_obj, quick_reply_obj, in_message , bool_obj, jump_to ,err_message , pause, generic_template_obj, webview_obj, cron_obj);

          console.log({res:res});

          let current_step = +step + 1;
          console.log("step " + current_step+ " of " + item.steps.length)
          if(res.status === true && current_step < item.steps.length) {
            console.log("step " + current_step+ " of " + item.steps.length)

            let data ={};

            //if result step is === next start the function loop function again
            //if status is pause, wait for user feedback

            switch(res.step) {

              case  "next":
                console.log("moving to the next step");
                user.messenger_processes[index].process_progress ++;
                let updated_user = await addandupdate_userfields.update_process_progress(sender_psid, processName, null, user.messenger_processes[index].process_progress);
                user_loop( process_name , user, index , incoming_msg );

                return NaN;
                break;

              case  "pause":
                console.log("waiting for input start function to continue");
                user.messenger_processes[index].process_progress ++;
                await addandupdate_userfields.update_process_progress(sender_psid, processName, null, user.messenger_processes[index].process_progress);

                return NaN;
                break;

              case "jump_to" :
               console.log("jumping to function link" + res.link);
               user.messenger_processes[index].process_progress = res.link;
               await addandupdate_userfields.update_process_progress(sender_psid, processName, null, user.messenger_processes[index].process_progress);
               user_loop(process_name , user_obj, index , incoming_msg  );

               return NaN;
               break;


              case "restart":
                console.log("restarting current function")
                user_loop(processName , user_obj , index , incoming_msg );
                return NaN;
                break;

              case "start_new_process" :
                console.log("starting new function " + res.link);

                //first delete the existing function 
                console.log("deleting current process " + processName);
                await addandupdate_userfields.delete_messenger_process( sender_psid, processName );

                // add the new userprocess to the db return an updated user user_obj
                let add_user_process =  await addandupdate_userfields.add_user_process(sender_psid, res.link, user);

                console.log({updated_user_obj:add_user_process.messenger_processes[0]});

                //find the index of the new process..
                //and add it to the messenger_process...

                await add_user_process.messenger_processes.forEach( async ( item  , index ) => {
                  console.log("searchig in item, found " + item.process_name);
                    if( item.process_name === res.link ) {
                      
                      console.log("found a matching process")
                      
                      console.log("jumpig to the new function " + res.link + " Index " + index);

                      await user_loop(res.link , add_user_process , index , incoming_msg);
                      //return NaN;

                    } 
                  
                 })

                return NaN;
                break;
              default:
                console.log("ingen data lagret starter programmet på nytt");
                return NaN;
            }


          } else {
            console.log("program ending");

            //when user has gone trough all object post or  status is false update process status to false and end process

            await addandupdate_userfields.delete_messenger_process( sender_psid, processName);
            return NaN;
          }

        } catch(e) {
          console.error(e);
        }


      } 

      // if result is positive jump to the next line, if result is negativ jump back
    });




}

//init


module.exports = user_loop;
