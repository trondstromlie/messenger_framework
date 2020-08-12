"use strict";

const process_loop = require('./process_loop');
const addandupdate_crontab = require('./addandupdate_crontab');
const { add_user_to_crontab } = require('./addandupdate_crontab');
const addandupdate_userfields = require('./addandupdate_userfields');
const fetchUserData = require('./fetchUserData');
const config = require('config');


//get the timestamp right now

 async function messenger_cron () {
    
    const time = Date.now();


    try {

    // fetch the array of pages with active cron-jobs return {pages:[n,n]}

    let activePages = JSON.parse(await addandupdate_crontab.get_all_crontab_pages());

    //console.log(activePages.pages);

    //get all crontabs from pages
    for( let active_page_item of activePages.pages ) {

        //console.log(item);

        let page_cron_tab = JSON.parse(await addandupdate_crontab.get_all_crontabs_from_page({page_id:active_page_item}));

        //console.log(page_cron_tab);

        for( let page_cronTab_item of page_cron_tab ) {
            console.log(page_cronTab_item);
            console.log(page_cronTab_item.timestamp);
            let date = new Date(page_cronTab_item.timestamp).getTime();
            console.log(date);
            if(date <= time) {



                //send to the messenger process loop 
                console.log("sending to the loop " + date + " is less than " + time );

                let user = await fetchUserData(page_cronTab_item.sender_psid);
                
                let received_message = null;

                let add_user_process =  await addandupdate_userfields.add_user_process(page_cronTab_item.sender_psid, page_cronTab_item.messenger_process , user.user);
                console.log({user:add_user_process});
                await process_loop(page_cronTab_item.messenger_process, add_user_process, 0 , received_message);

            }
        }


        //delete all croontabs where timestamp is less the timestamp now


        let updated_page_cron_tab_loop = page_cron_tab.filter(item => {
            let item_timestamp = new Date(item.timestamp).getTime();
            if(item_timestamp > time ) return item;
        });

        console.log({updated_crontab:updated_page_cron_tab_loop})

        await addandupdate_crontab.delete_and_update_crontabs({page_id:active_page_item, crontab_loop:updated_page_cron_tab_loop});
        console.log("crontab cleaned");

    }

    } catch (e) {
        console.log(e);
    }
    
} 

module.exports = messenger_cron;


//foreach active page 
//fetch the cron_tab

//run throug all crontabs, if crontab is less the time now crontab
//run this crontab
//add process to users db start process 


//clean the db of all tabs where timestamp is less then time now....


//return to the db 