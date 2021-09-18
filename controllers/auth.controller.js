const asyncHandler=require("../middleware/async");
const User =require("../model/user.model");
const ErrorResponse = require("../utilis/errorResponse");
const crypto = require("crypto");


// @desc    Regester User
// @route   POST/api/v1/auth/regester
// @access  Public
exports.regester = asyncHandler(async(req,res,next) =>{
   const {name,email,password,role}=req.body;

  //  Create User
  const user = await User.create({
    name,
    email,
    password,
    role
  });

  // Create Token And Respose And Cookie
  sendTokenResponse(user, 200, res);

});

// @desc    Login User
// @route   POST/api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async(req,res,next) =>{
  const {email,password}=req.body;

  // Validate email and password
  if(!email || !password){
    return next(new ErrorResponse ("please provide an email and password" ,400));
  }

  // Check for user
  const user = await User.findOne({email}).select("+password");

  if(!user){
    return next(new ErrorResponse ("Invalid" ,401));
  }

  // Check password matches
  const isMatch = await user.matchPassword(password);

  if(!isMatch){
    return next(new ErrorResponse ("Invalid" ,401));
  }
  
  // Create Token And Respose And Cookie
  sendTokenResponse(user,200,res);
});

// @desc    Log User out / clear Cookie
// @route   GET/api/v1/auth/logout
// @access  private
exports.logout = asyncHandler(async (req,res,next) =>{

  res.cookie("token","none",{
    expires : new Date(Date.now() + 10 * 1000),
    httpOnly:true
  })

  res.status(200).json({
    success:true,
    data:{}
  })
});

// @desc    Get All logged  users
// @route   GET/api/v1/auth/users
// @access  public
exports.getUsers = asyncHandler(async (req,res,next) =>{
  const user = await User.find();

  res.status(200).json({
    success:true,
    data:user
  })
});

// @desc    Get Current logged in user
// @route   GET/api/v1/auth/me
// @access  private
exports.getMe = asyncHandler(async (req,res,next) =>{
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success:true,
    data:user
  })
});


// Get token from Model ,Create cookie and send Response
const sendTokenResponse = (user, statusCode, res) => {

  // Create Token
  const token = user.getSignedJwtToken();

  const options={
    expires:new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly:true
  };

  if(process.env.NODE_ENV === "production"){
    options.secure=true
  };

  res
    .status(statusCode)
    .cookie("token",token,options)
    .json({
      success:true,
      message:"User Create Successfully",
      token
    })
};
