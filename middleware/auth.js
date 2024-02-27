const jwt = require("jsonwebtoken");
const User=require("../model/user.model");
const ErrorResponse=require("../utils/errorResponse");
const asyncHandler=require("./async");


// Protect Routes
exports.protect = asyncHandler(async (req,res,next) => {

  let token;

  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    token = req.headers.authorization.split(" ")[1];
  }

  // else if(req.cookies.token){
  //   token=req.cookies.token;
  // }

  // Make Sure Token Exists
  if(!token){
    return next(new ErrorResponse("Not Authorise to access this route",401));
  }

  try {
    // Verify Token
    const decoded=jwt.verify(token,process.env.JWT_SECRET);

    req.user= await User.findById(decoded.id);
    
    next();

  } catch (err) {
    return next(new ErrorResponse("Not Authorise to access this route",401));
  }

});

// Grand access to Specific roles
exports.authorize = (...roles) => {
  return (req,res,next) =>{
    if(!roles.includes(req.user.role)) {
      return next(new ErrorResponse(`user role ${req.user.role} is not authorized to access this route`,403));
    }
    next();
  }

};