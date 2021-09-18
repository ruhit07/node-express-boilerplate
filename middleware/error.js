const ErrorResponse = require("../utilis/errorResponse");

const errorHandelar = (err,req,res,next) =>{

  let error = {...err};

  error.message = err.message;

  // Log for Developers
  console.log(err);

  // Mongoose bad ObjectId
  if(err.name === "CastError"){
    const message = `Resource not found`
    error = new ErrorResponse (message,404)
  };

  // Mongoose Validation Error
  if(err.name === "ValidationError"){
    const message = Object.values(err.errors).map(val => val.message)
    error = new ErrorResponse(message,400)
  };

  // Mongoose Duplicate Key
  if(err.code === 11000){
    const message = `Duplicate Value Entered`
    error = new ErrorResponse(message,400)
  };

  res.status(error.statusCode || 500).json({
    success : false,
    message: error.message || "Server Error"
  });

};

module.exports = errorHandelar;