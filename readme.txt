//todo list

//API SERVER SIDE

//user
Register user #public
  write to mongodb
  mongoose
  express


Login user and get token #public
  jwtoken



//Data

get location data and and status
  push message to appropriat service, trond is on his way notification
  when status change to "en route" push message, when status change to "found kristina" send new message

messenger integration
  send message
  ask for location

google assistent
  ask for location

//DEVICE SIDE

  Sniff for change in wifi
  when wifi is no longer home-net and time is between 3.30 and 4.30 activate program
  listen to bluethoot, when phone connects to kristinas bluethoot mac adress, deactivate push new status to service
