const config = require('config');
const request = require('request');

 module.exports = function (sender_psid) {

   this.psid = sender_psid;
   this.first_name = "";
   this.last_name ="";
   this.user = {};


  request({ url: "https://graph.facebook.com/v2.6/" + this.psid,
            qs: { access_token: config.get("FbPageToken"),
            fields: "first_name,middle_name,last,name" }, method: "GET"
            }, (error, response, body) =>
              {
                console.log(body);

            }
          )
 };
