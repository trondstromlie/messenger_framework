

"use strict";
const process_functions = require('./process_functions');
const fs = require('fs');

const readline = require('readline');


//the user loop functions
//starts when handle message discovers an active userProcess in the user procecces field
//index is the index of the userprocess in case there is more than one.
//only one user process can be activ in one time.



async function user_loop (process_name , user_obj, index ) {

  let user = user_obj;
  let step = user.processes[index].step;

  //the user processes imported from mongodb
  //**************************************************************
  const user_process = {processes: [
    {
     name:"get_personal",
     steps: [

         {name:"send_empty_message",func:process_functions.send_empty_message ,msg:"Hei "+ user.first_name +" før du kan registrer deg må jeg få vite litt mer om hvem du er :) "},
         {name:"writing_action",func:process_functions.writing_action},
         {name:"ask for email",func:process_functions.send_empty_message, msg:"Skriv din beste epostadresse her, eller velg adressen facebook har foreslått for deg. " },
         {name:"ask for email quick reply",func:process_functions.send_quick_reply,quick_reply_obj:{"msg":"email","payload":"email"}},
         {name:"listen_for_email",func:process_functions.listen_for_data,custom_field_name:"email",msg:"Skriv din epost her >> "},
         {name:"confirm_data",func:process_functions.send_empty_message,custom_field_name:"email", msg:"Du skrev {<custom_field>} bekreft med knappen under at det er riktig "},
         {name:"confirm email",func:process_functions.send_quick_reply,quick_reply_obj:[{"msg":"Ja","payload":"send takk",link:8},{"msg":"Nei","payload":"ask for email",link:2}]},
         {name:"listen_for_email",func:process_functions.listen_for_quick_reply,custom_field_name:"email", msg:"Skriv ja eller nei >> " , quick_reply_obj:[{"msg":"Ja","payload":"send takk",link:8},{"msg":"Nei","payload":"ask for email",link:2}]},
         {name:"send takk",func:process_functions.send_empty_message, msg : "Takk :) " },
         {name:"writing_action",func:process_functions.writing_action},
         {name:"get_mothers_name",func:process_functions.send_empty_message, msg:"Nå må jeg vite litt om din fammilie :) "},
         {name:"listen_for_mor",func:process_functions.listen_for_data,type:"text", custom_field_name:"mor", msg:"skriv navnet på moren din her  >> "},
         {name:"confirm_data_mor",func:process_functions.send_empty_message,custom_field_name:"mor", msg:"Du skrev {<custom_field>} bekreft med knappen under at det er riktig "  },
         {name:"confirm mor",func:process_functions.send_quick_reply,quick_reply_obj:[{"msg":"Ja","payload":"send to bio",link:15},{"msg":"Nei","payload":"ask for mother",link:10}]},
         {name:"listen_for_mor",func:process_functions.listen_for_quick_reply,custom_field_name:"mor", msg:"Skriv ja eller nei >> " , quick_reply_obj:[{"msg":"Ja","payload":"send to bio",link:15},{"msg":"Nei","payload":"ask for mother",link:10}]},
         {name:"get_bio",func:process_functions.send_empty_message, msg:"Skriv litt om deg selv " , field_name:"bio"},
         {name:"listen_for_bio",func:process_functions.listen_for_data,type:"text",custom_field_name:"bio",msg:"hva er din bio, skriv det her >> "},
         {name:"confirm_data_bio",func:process_functions.send_empty_message,custom_field_name:"bio", msg:"Du skrev {<custom_field>} bekreft med knappen under at det er riktig "  },
         {name:"confirm bio",func:process_functions.send_quick_reply,quick_reply_obj:[{"msg":"Ja","payload":"send to bio",link:20},{"msg":"Nei","payload":"ask for bio",link:15}]},
         {name:"listen_for_bio",func:process_functions.listen_for_quick_reply,custom_field_name:"mor", msg:"Skriv ja eller nei >> " , quick_reply_obj:[{"msg":"Ja","payload":"send to bio",link:20},{"msg":"Nei","payload":"ask for mother",link:15}]},
         {name:"send_empty_message",func:process_functions.send_empty_message, msg: "Takk du er nå registrert "}
        ] },
    {

      name:"email",
      steps: [
         {name:"get_email",func:process_functions.get_email, msg:"skriv din beste epost adresse her"}
      ]
    }
    ]
  }; //end of object ***************************************

    await user_process.processes.forEach(async (item, i) => {



      if(item.name === user.processes[index].name ) {
        try {

          console.log("\n\n********* starting " + item.steps[step].name +  " **********\n\n");

          let message = null;
          let custom_field_name = null;
          let quick_reply_obj = null;

          if( item.steps[step].msg ) message = item.steps[step].msg;

          if( item.steps[step].custom_field_name ) custom_field_name = item.steps[step].custom_field_name;

          if( item.steps[step].quick_reply_obj ) quick_reply_obj = item.steps[step].quick_reply_obj ;


          let item_function = item.steps[step].func;


          let res = await item_function(user.sender_psid, user, message, custom_field_name, quick_reply_obj);

          console.log({res:res});

          let current_step = step + 1;
          if(res.status === true && current_step < item.steps.length) {
            console.log("step " + current_step+ " of " + item.steps.length)

            let data ={};
            //if result. step is === next start the function loop function agein
            //if status is pause, wait for user feedback

            switch(res.step) {

              case  "next":
                console.log("moving to the next step");
                user.processes[index].step ++;
                data = JSON.stringify(user)
                await fs.writeFileSync('the_user_object.json', data);
                user_loop(process_name , user_obj, index );
                return NaN;
                break;

              case  "pause":
                console.log("waiting for input start function to continue");
                user.processes[index].step ++;
                data = JSON.stringify(user)
                await fs.writeFileSync('the_user_object.json', data);
                return NaN;
                break;

              case "jump_to" :
               console.log("jumping to function link"+ res.link)
               user.processes[index].step = res.link;
               data = JSON.stringify(user);
               await fs.writeFileSync('the_user_object.json', data);
               user_loop(process_name , user_obj, index );
               return NaN;
               break;


              case "restart":
                console.log("restarting current function")
                user_loop(process_name , user_obj, index );
                return NaN;
                break;
              default:
                console.log("ingen data lagret starter programmet på nytt");
                return NaN;
            }


          } else {
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
