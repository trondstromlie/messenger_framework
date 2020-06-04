const express = require('express');
const connectDb = require('./config/db');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require("path");

const PORT = process.env.PORT || 3000;


const app = express();

//connect to database
connectDb();


//init middleware
app.use(express.json({ extended:false }));
app.use(morgan('dev')); // log every request to the console.
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'public')));

app.set('view engine', 'pug');
app.set('views',path.join(__dirname,'views'));
console.log(path.join(__dirname));

//API routes for the server
app.use("/api/user", require("./routes/api/user"));
app.use("/api/status", require("./routes/api/status"));
app.use("/api/serviceupdate", require("./routes/api/serviceupdate"));

//api routes for the messenger integration
app.use("/api/messenger/check_in_user", require("./routes/api/check_in_user"));
app.use("/api/messenger/messenger_user_details", require("./routes/api/messenger_user_details"));

//API route for the messenger web_hook
app.use("/api/verify", require("./routes/api/webhook_verify"));
app.use("/messengerapp/webhook", require("./messengerApp/webhook"));

//Routes for views
app.use("/", require("./routes/pages/pages"));



//start server

app.listen(PORT, () => {console.log('server is running on port ' + PORT)});
