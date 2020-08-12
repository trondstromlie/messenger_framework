"use strict";
const request = require('request');

//test function


//add user to crontab
//takes in a object containing the { sender_psid, page_id, field_name , field value , messenger_process , timestamp }

async function add_user_to_crontab (data) {

    let { sender_psid, page_id, field_name , field_value , messenger_process , timestamp } = data;


    //build the request options
    let options = {
        url:"https://phonestats.herokuapp.com/api/messenger/add_userCrontab_loop",
        method : "POST",
        json: data,
    };

    //create the Promise
    return new Promise ( ( resolve , reject ) =>  {

        //do some ascync stuff here

        request (options , (err ,res, body) => {
            if(err) {
                reject(err);
            } else {
                resolve(body);
            }
        });

    });
}

//delete user from crontab
//a hook in the update field process delete a user from crontab if field value is changed....
//accepts {sender_psid, page_id, field_name, field value}

async function delete_user_crontab_on_unsubscribe (data) {

    let {sender_psid, page_id, field_name, field_value} = data;

    let options = {
        url : "https://phonestats.herokuapp.com/api/messenger/add_userCrontab_loop",
        method :"DELETE",
        json: data
    } ;

    //create the promise 
    return new Promise ( (resolve, reject ) => {

        //do the async work here.

        request(options, (err, res , body) => {
            if(err) {
                reject(err);
            } else {
                resolve(body);
            }
        }) 
    })

};



//get all pages 


async function get_all_crontab_pages () {

    

    let options = {
        url : "https://phonestats.herokuapp.com/api/messenger/add_userCrontab_loop/all_pages",
        method :"GET",
        
    } ;

    //create the promise 
    return new Promise ( (resolve, reject ) => {

        //do the async work here.

        request(options, (err, res , body) => {
            if(err) {
                reject(err);
            } else {
                resolve(body);
            }
        }) 
    })

};



//get all cron_tabs
//qs is page_id


async function get_all_crontabs_from_page (data) {

    let {page_id, sender_psid} = data;
    let url = "https://phonestats.herokuapp.com/api/messenger/add_userCrontab_loop" + "/" + page_id

    let options = {
        url : url,        
        method :"GET"       
    } ;

    //if sender_psid
    //include sender_psid in json return only crontab from spesific user
    //if no sender_psid return all crontabs from page 

    if(sender_psid ) options.json = sender_psid;

    //create the promise 
    return new Promise ( (resolve, reject ) => {

        //do the async work here.

        request(options, (err, res , body) => {
            if(err) {
                reject(err);
            } else {
                resolve(body);
            }
        }) 
    })

};


//update a pages crontabs 
//accepts page is and the array of waiting crontab loops
//{ page_id , crontab_loop }



async function delete_and_update_crontabs (data) {

    let  {page_id, cron_tab_loop } = data;

    let options = {
        url : "https://phonestats.herokuapp.com/api/messenger/add_userCrontab_loop",
        method :"PUT",
        json:{page_id:page_id, cron_tab_loop:cron_tab_loop}
        
    } ;

    //create the promise 
    return new Promise ( (resolve, reject ) => {

        //do the async work here.

        request(options, (err, res , body) => {
            if(err) {
                reject(err);
            } else {
                resolve(body);
            }
        }) 
    })

};




module.exports = {
    add_user_to_crontab:add_user_to_crontab,
    delete_user_crontab_on_unsubscribe:delete_user_crontab_on_unsubscribe,
    get_all_crontab_pages:get_all_crontab_pages,
    get_all_crontabs_from_page:get_all_crontabs_from_page,
    delete_and_update_crontabs: delete_and_update_crontabs

};