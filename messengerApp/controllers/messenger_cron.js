"use strict";

const process_loop = require('./process_loop');
const addandupdate_crontabs = require('./addandupdate_crontab');
const addandupdate_crontab = require('./addandupdate_crontab');


//get the timestamp right now

const time = Date.now();

// fetch the array of pages with active cron-jobs

const activePages = addandupdate_crontab.get_all_crontab_pages();
console.log(activePages);




//foreach active page 
//fetch the cron_tab

//run throug all crontabs, if crontab is less the time now crontab
//run this crontab
//add process to users db start process 


//clean the db of all tabs where timestamp is less then time now....


//return to the db 