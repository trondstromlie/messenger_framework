"use strict";
const config = require('config');
const request = require('request-promise');
const path = require('path');

 module.exports = async function (sender_psid) {

    try{
      //check if user is already in db
      //connect to API
      let status = await GETmesssengerDB_API(sender_psid);
      console.log(status);
      if (status.statusCode === 300) {
        //add user to DB
        let userFields = await userFields(sender_psid);
        console.log({userFields:userFields})
        let newUser = await POSTAddUser(userFields);
        console.log({newUser:newUser});
        return newUser;
      } else if (status.statusCode === 200){
        return status.body;

      }else {
        console.log(status.error);
        throw status.error;
      }



    } catch(e) {
      console.error(e.message);
    }



  };//end of module exports function


async function user_fields (sender_psid) {
     try {
        let user_fields;
        var data =  await request({
                 url: "https://graph.facebook.com/v2.6/" + sender_psid,
                 qs: { access_token: config.get("FbPageToken"),
                 fields: "first_name, last_name, name, profile_pic" },
                 method: "GET"
               },  function (error, response, body)
                   {
                     console.log(error);
                     console.log(response);

                     if(!error) {
                      user_fields = JSON.parse(body);
                   } else {
                     console.error({"unable to get user data": error});
                   }

                 }); //facebook request function

               return user_fields

         } catch(e) {
           console.error(e.message)
         } //end of try catch block for facebook api GET
     }; //end user fields function facebook get user fields API API


  //function to make request to the api //first check if user exists, if not ad user to db
  //return status code 300 if no user exist, if user exist return user data body
  async function GETmesssengerDB_API (sender_psid) {
     try {
       let data = await request({
         url:"https://phonestats.herokuapp.com/api/messenger/messenger_user_details",
         method:"GET",
         json: {"sender_psid":sender_psid}

       }, (err, res, body) => {
         console.log(body);
         console.log(res.body);
         if(!err) {
           console.log("get request ok")
           if(res.statusCode === 300) {
             return {status:res.statusCode};
           }else if (res.status === 200 ) {
             return {status:200,body:JSON.parse(body)};
           }

         } else {
           return {error:err};
           console.log({"status":"get not working",err})
         }
       });

     } catch(e) {
       console.error(e.message);
     }
   }// end of getuserAPI function

   //function to add user to database
   //returns user fields
  async function POSTAddUser (psid,userFields) {
     try{
       let data = await request({
         url:"https://phonestats.herokuapp.com/api/messenger/messenger_user_details",
         headers:{"Content-Type":"aplication/json"},
         json:{"sender_psid":sender_psid, userFields},
         method:"POST"
       }, (error, result, body) => {
         if(!error) {
           console.log({msg:"user added to db",body});
           return body

         }
       });
     }catch(e) {
       console.error(e.message);
     }
   };//end of add user function
