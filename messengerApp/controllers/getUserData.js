"use strict";
const config = require('config');
const request = require('request-promise');

 module.exports = async function (sender_psid) {
  var userData = {};

try {
   await request({ url: "https://graph.facebook.com/v2.6/" + sender_psid,
            qs: { access_token: config.get("FbPageToken"),
            fields: "first_name,last_name" }, method: "GET"
          },  function (error, response, body)
              {
                if(!error) {
                 userData = body;
              } else {
                console.error({"unable to get user data": error});
              }

            })
          console.log({"getUserData": userData});

    }catch(e) {
      console.error(e.message)
    }.then() {return userData; }

  };
