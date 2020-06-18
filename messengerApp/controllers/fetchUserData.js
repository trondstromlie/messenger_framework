"use strict";
const request = require("request");
const config = require("config");


//**********************************************
// public function to check if user is in db if not add user to db
//*********************************************

async function fetchUserData (sender_psid) {


  return new Promise(async ( reject , resolve ) => {

    let userFields = {};

 try {
   //get the user data

   var user = await GETcheckIfUserMesssengerDB_API(sender_psid);



     if (user.status === 300) {


     console.log("getting data from facebook");
     let facebookUserfields = await user_fields(sender_psid);
     facebookUserfields.sender_psid = sender_psid;

     console.log("adding data to db");


     let adduser = await POSTAddUser(facebookUserfields);

     userFields = adduser;

     console.log({status:"user added to db"});

     //console.log({"status300":userFields});

     resolve(userFields);


   } else if (user.status === 200) {

     userFields = user;
     //console.log({status200:userFields});
     console.log("returning data");
     resolve(userFields);
   }
   reject("error");

 } catch(err) {
   console.log("error block #api messenger get userfields ");
   console.error(err);
 }





});//end Promise
 }; //end main function

 //*******************************************
 // Helper functions
 //******************************

//function to make request to the api //first check if user exists,
//return status code 300 if no user exist, if user exist return user data body

function GETcheckIfUserMesssengerDB_API (sender_psid) {

  let options = {
    url:'https://phonestats.herokuapp.com/api/messenger/messenger_user_details',
    method:"GET",
    json:{"sender_psid":sender_psid}
  };

  //return the Promise
  return new Promise( (resolve, reject) => {
    //do the async work here
    request(options, ( err, response, body ) => {
      if(err) {
        reject(err);

      } else {
        resolve(body)

      }
    })
  })

};


 //function to add user to database
 //returns user fields
function POSTAddUser (userfields) {

  let options = {
    url:"https://phonestats.herokuapp.com/api/messenger/messenger_user_details",
    method:"POST",
    json:userfields
  };
  //return new promis
  return new Promise( ( resolve, reject ) => {
    request(options, ( err, response, body ) => {
        if (err) {
          console.log("error detected");
          reject(err);
        } else {
          if(response.statusCode === 200) {
            resolve(body);
          }
          else {
            console.log("status 300");
            resolve({status:300});
        }
        }
    })
  });
}


function user_fields (sender_psid) {
  let options = {
    url : "https://graph.facebook.com/v2.6/" + sender_psid,
    qs : { access_token: "EAAHuUAxrQ8QBAOkvPVAIaq0vHnrcUDm86NiwTuk83tu2UtYEnn5gFRvSQpIvCtQGGNRq5xW230gzXdEJUlexHfdVpulQYBUeAEyOHMQPL6h25au4XIXexVyJv261ndLyuQEXJFsgaIzB0sezFU08mg9oMW9EL4c0gCuZAWQtqokrkCb1kNFkGy6XpsQ8ZD",
    fields: "first_name, last_name, name, profile_pic" },
    method:"GET"
  };

  //return Promise
  return new Promise( ( resolve, reject ) => {
    request(options, ( err, response , body )=> {
        if(err) {
          reject(err);
        }else {
          resolve(JSON.parse(body));
        }
    })
  })
}

module.exports = fetchUserData;
