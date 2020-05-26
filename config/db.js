//connect to the database
const mongoose = require('mongoose');
const config = require('config');
const db = config.get("localMongoURI");

const connectDb = async () => {
  try {
   await mongoose.connect(db, {
     useNewUrlParser:true,
     useUnifiedTopology:true,
     useCreateIndex:true
    });
    console.log('DB is running');
  } catch(e) {
    console.error(e.message);
    //quitt process wit failure
    process.exit(1)
  }

};
module.exports = connectDb
