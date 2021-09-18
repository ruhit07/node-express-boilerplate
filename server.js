const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cookieParser=require("cookie-parser");
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const errorHandelar = require("./middleware/error");
const connectDB = require("./config/db");

const app = express();

// Load env vars
dotenv.config({path : "./config/config.env"});

// Connect To Database
connectDB();

//Route Files
const mountRoute = require('./routes/routes');


// Dev loggin middleware
if(process.env.NODE_ENV === "development"){
  app.use(morgan("dev"));
};

// Rate Limiting
const limiter=rateLimit({
  windowMs : 10 * 60 * 1000,   // 10 Minite  100 request
  max :100 
});

// Middleware
app.use(express.json());   //Body parser
app.use(cookieParser());   //Cookie parser 
app.use(mongoSanitize());  //Sanitize Data
app.use(helmet());         //Set secutity Headers
app.use(xss());            //Pevent XSS attacks
app.use(hpp());            //Prevent http param pollution
app.use(limiter);          //Rate limiting
app.use(cors());           //Enable Cors


// Mount Route
mountRoute(app);  

// custom errorHandler Middle
app.use(errorHandelar);

const PORT = process.env.PORT || 5000;

// server Create
const server = app.listen(PORT , () =>{
  console.log(`Server Running In ${process.env.NODE_ENV} On ${PORT}`.yellow.bold);
});


// Handle Unhandelar Promise rejection
process.on("unhaldleRejection" , (err,promise) =>{
  console.log(`Error : ${err.message}`.red);

  server.close(() => process.exit(1));
})
