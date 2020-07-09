const config = require('config');
const request = require('request');


//function accepts writing_on writing_off and mark_seen 
module.exports =  async function  SenderAction(sender_psid,sender_action) {

    //construct the message body
    
    let options = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs:{'access_token': config.get('FbPageToken')},
        method:"POST",
        json : {
            "recipent":{"id":sender_psid},
            "sender_action":sender_action
        }
    }

    //create the promise

    return new Promise( (resolve, reject) => {

        request(options, ( err , res , body ) => {
            if(err) {
                reject(err);
            } else {
                resolve(body);
            }
        });

    }); //end of promise

}