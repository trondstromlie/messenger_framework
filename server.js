const express = require('express');
const connectDb = require('./config/db');

const PORT = process.env.PORT || 3000;



const app = express();
//connect to database
connectDb();


//init middleware
app.use(express.json({ extended:false }));

//blanc index

app.get("/", (req,res) => {
  res.send("hello world");
});

//API routes
app.use("/api/user", require("./routes/api/user"));
app.use("/api/status", require("./routes/api/status"));
app.use("/api/serviceupdate", require("./routes/api/serviceupdate"));



//start server

app.listen(PORT, () => {console.log('server is running on port ' + PORT)});
