const config = require('config');
const request = require('request');

 module.exports = function (sender_psid) {
  var userData;
  console.log({"getUserData"})


  request({ url: "https://graph.facebook.com/v2.6/" + sender_psid,
            qs: { access_token: config.get("FbPageToken"),
            fields: "first_name,last_name" }, method: "GET"
            }, (error, response, body) =>
              {
                if(!error) {
                console.log(body)
                userData = body;
              } else {
                //console.log(error);
              }

            });
      return userData;
 };
