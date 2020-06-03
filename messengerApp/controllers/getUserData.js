"use strict";
const config = require('config');
const request = require('request-promise');

 module.exports = async function (sender_psid) {
    var userData = {};

try {
   let user_fields;
   var data =  await request({
            url: "https://graph.facebook.com/v2.6/" + sender_psid,
            qs: { access_token: config.get("FbPageToken"),
            fields: "first_name,last_name" },
            method: "GET"
          },  function (error, response, body)
              {
                if(!error) {
                 user_fields = body;
              } else {
                console.error({"unable to get user data": error});
              }

            })
          console.log({"getUserData": user_fields});
          return {"name":"input_field","last name":"input_field"};

    }catch(e) {
      console.error(e.message)
    } () => {}
    console.log(data.userData)
 //return {"name":"trond"};
  };
