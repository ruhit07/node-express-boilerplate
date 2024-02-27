const mongoose = require("mongoose");
const config = require("./config");

const connectDB = async () =>{
  
  const conn = await mongoose.connect(config.MONGO_URI,{
    useNewUrlParser: true, 
    useUnifiedTopology: true
  });
  
  console.log(`Mongodb Database Connected in ${conn.connection.host}`.yellow.bold);
};

module.exports = connectDB;