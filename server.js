const express = require('express');
const connectDb = require('./config/db');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;



const app = express();

//connect to database
connectDb();


//init middleware
app.use(express.json({ extended:false }));
app.use(morgan('dev')); // log every request to the console.
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());

//blanc index

app.get("/", (req,res) => {
  res.send("hello world");
});

//API routes
app.use("/api/user", require("./routes/api/user"));
app.use("/api/status", require("./routes/api/status"));
app.use("/api/serviceupdate", require("./routes/api/serviceupdate"));

//API route for the messenger web_hook
app.use("api/webhook_verify", require("./routes/api/webhook_verify"));



//start server

app.listen(PORT, () => {console.log('server is running on port ' + PORT)});
