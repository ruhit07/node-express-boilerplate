const config = require('../config/config');
const User = require("../models/user.model");
const asyncHandler = require("../middleware/async");
const { env_mode } = require("../enums/common.enum");
const ErrorResponse = require("../utils/errorResponse");
const { registerUserSchema } = require('../validation/auth.validation');

// @desc    Regester User
// @route   POST/api/v1/auth/regester
// @access  Public
exports.regester = asyncHandler(async (req, res, next) => {

  const reqBody = await registerUserSchema(req.body);

  const { name, email, password, role } = reqBody;

  // Check for user
  let user = await User.findOne({ email }).select("+password");
  if (user) {
    return next(new ErrorResponse('Email exists', 401));
  }

  //  Create User
  user = await User.create({ name, email, password, role });

  // Create token and respose and cookie
  sendTokenResponse(user, 200, 'Registration successfull', res);
});

// @desc    Login User
// @route   POST/api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse("please provide an email and password", 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid", 401));
  }

  // Check password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid", 401));
  }

  // Create Token And Respose And Cookie
  sendTokenResponse(user, 200, res);
});

// @desc    Log User out / clear Cookie
// @route   GET/api/v1/auth/logout
// @access  private
exports.logout = asyncHandler(async (req, res, next) => {

  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  })

  res.status(200).json({
    success: true,
    data: {}
  })
});


// @desc    Get Current logged in user
// @route   GET/api/v1/auth/me
// @access  private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  })
});


// Get token from Model, Create cookie and send Response
const sendTokenResponse = (user, statusCode, message, res) => {

  // Create Token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + config.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000 // 1 day = 24 * 60 * 60 * 1000 ms
    ),
    secure: config.NODE_ENV === env_mode.PRODUCTION
  };


  res
    .status(statusCode)
    .cookie('token', token, options)
    .cookie('accessToken', token, { ...options, httpOnly: true })
    .json({
      success: true,
      message,
      data: {
        user,
        token
      }
    });
};
