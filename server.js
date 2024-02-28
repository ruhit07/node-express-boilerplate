require('colors');
const hpp = require("hpp");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require('express-mongo-sanitize');

const connectDB = require("./config/db");
const config = require('./config/config');
const errorHandelar = require("./middleware/error");

const app = express();

// Connect To Database
connectDB();

//Route Files
const mountRoute = require('./routes/routes');

// Dev loggin middleware
if (config.NODE_ENV === "development") {
  app.use(morgan("dev"));
};

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,   // 10 Minite  100 request
  max: 100
});

// Middleware
app.use(express.json());   //Body parser
app.use(cookieParser());   //Cookie parser 
app.use(mongoSanitize());  //Sanitize Data
app.use(helmet());         //Set secutity Headers
app.use(hpp());            //Prevent http param pollution
app.use(limiter);          //Rate limiting
app.use(cors());           //Enable Cors


// Mount Route
mountRoute(app);

// custom errorHandler Middle
app.use(errorHandelar);

const PORT = config.PORT || 5000;

// server Create
const server = app.listen(PORT, () => {
  console.log(`Server running in ${config.NODE_ENV} mode on port ${PORT}`.cyan.bold);
});


// Handle Unhandelar Promise rejection
process.on("unhaldleRejection", (err, promise) => {
  console.log(`Error : ${err.message}`.red);

  server.close(() => process.exit(1));
})
