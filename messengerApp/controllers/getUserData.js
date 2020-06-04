"use strict";
const config = require('config');
const request = require('request-promise');
const path = require('path');

 module.exports = async function (sender_psid) {
    var userData = {};
    console.log("url til denne siden  " + path.join(__dirname));
try {
  //let data = await request({
  //  url:"/api/messenger/"
  console.log("mm")



}catch(e) {
  console.error(e.message);
}


try {
   let user_fields;
   var data =  await request({
            url: "https://graph.facebook.com/v2.6/" + sender_psid,
            qs: { access_token: config.get("FbPageToken"),
            fields: "first_name, last_name, name, profile_pic" },
            method: "GET"
          },  function (error, response, body)
              {
                if(!error) {
                 user_fields = JSON.parse(body);
              } else {
                console.error({"unable to get user data": error});
              }

            })
          //console.log({"getUserData": user_fields});
          return user_fields

    }catch(e) {
      console.error(e.message)
    }
 //return {"name":"trond"};
  };
