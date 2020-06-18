
"use strict";
const prosess_functions = require('./process_functions');

const readline = require('../../node_modules/readline/readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


rl.question("hva lurer du på? >> ", (svar) => {
  console.log(svar);
});

//th1e prosess_loop start the moment a user has an active prosess.
//all processes are represented by an object

//test process is get personale information

//if the user has an active prosess in the user.prosess object

let user = {
  name:"Trond",
  sender_psid:123456789,
  process:[
    {name:"get_personal", is_active:true, step:0 }
  ],
  email:null,
  custom_data:[{test:"test"}]
}


const process = {procecces: [
  {
    name:"get_personal",
    steps: [

       {"send_empty_message":send_message(sender_psid,name,process.processes[0].steps[0].msg),msg:"Hei før du kan registrer deg må jeg få vite litt mer om deg :) "},
       {"get_email":get_email( sender_psid, name, process.processes[0].steps[1].msg ),msg:"Skriv din beste epostadresse her, eller velg adressen facebook har foreslått for deg. " },
       {"confirm_data":confirm_data( sender_psid, name , process.processes[0].steps[1].msg ),msg:"Du skrev " + user.email +" bekreft med knappen under at det er riktig " },
       {"send_empty_message":send_empty_message(sender_psid , name , process.processes[0].steps[2].msg) , msg : "Takk :) " },
       {"get_mothers_name":get_text_innput(sender_psid, name, process.processes[0].steps[3].msg),msg:"Hva heter moren din :) " , field_name:"mor"},
       {"get_mothers_name":get_text_innput(sender_psid, name, process.processes[0].steps[3].msg),msg:"Skriv litt om deg selv " , field_name:"bio"},
       {"send_empty_message":send_empty_message(sender_psid,process.processes[0].steps[4].msg),msg: "Takk du er nå registrert "}
      ]

  }
]  }; //end of object
async function main () {

  let x = true;

  while (x = true) {

    process.processes.forEach((process, i) => {
      console.log(process +  " " + i)
    });




  }

}
