const config = require('config');
const request = require('request');

 module.exports = function (sender_psid) {

   this.psid = sender_psid;
   this.first_name = "";
   this.last_name ="";
   this.user = {};


  request({ url: "https://graph.facebook.com/v2.6/" + sender_psid,
            qs: { access_token: config.get("FbPageToken"),
            fields: "first_name,last_name" }, method: "GET"
            }, (error, response, body) =>
              {
                if(!error) {console.log(body)
                }
                console.log(error);

            }
          )
 };
