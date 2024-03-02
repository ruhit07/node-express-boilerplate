const config = require('../config/config');
const User = require("../models/user.model");
const asyncHandler = require("../middleware/async");
const { env_mode } = require("../enums/common.enum");
const ErrorResponse = require("../utils/errorResponse");
const { registerUserSchema, loginUserSchema, updateUserDetailsSchema, updatePasswordSchema } = require('../validation/auth.validation');

// @desc    Regester User
// @route   POST/api/v1/auth/regester
// @access  Public
exports.regester = asyncHandler(async (req, res, next) => {

  const reqBody = await registerUserSchema(req.body);

  const { name, email, password, role } = reqBody;

  // Check for user
  let user = await User.findOne({ email }).select("+password");
  if (user) {
    return next(new ErrorResponse('Email exists', 404));
  }

  //  Create User
  user = await User.create({ name, email, password, role });

  // Create token and respose and cookie
  sendTokenResponse(user, 201, 'Registration successfull', res);
});

// @desc    Login User
// @route   POST/api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {

  const reqBody = await loginUserSchema(req.body);

  const { email, password } = reqBody;

  // Check for user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Check password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  // Create Token And Respose And Cookie
  sendTokenResponse(user, 200, 'Login successfull', res);
});

// @desc    Logout User
// @route   GET/api/v1/auth/logout
// @access  private
exports.logout = asyncHandler(async (req, res, next) => {

  Object.entries(req.cookies).forEach(([key, value]) => res.clearCookie(key));

  res.status(200).json({
    success: true,
    message: "Logout successfully",
    data: {}
  });
});


// @desc    Get Current logged in user
// @route   GET/api/v1/auth/me
// @access  private
exports.getMe = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Authentication Failed', 401));
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorResponse(`No User with the id of ${req.user.id}`, 404));
  }

  res.status(200).json({
    success: true,
    message: "Current logged in user",
    data: user
  })
});


// @desc      Delete current user
// @route     DELETE /api/v1/auth/me
// @access    Private
exports.deleteMe = asyncHandler(async (req, res, next) => {

  if (!req.user) {
    return next(new ErrorResponse('Authentication Failed', 401));
  }

  const user = await User.findByIdAndDelete(req.user.id);
  if (!user) {
    return next(new ErrorResponse(`User Not Found With Id Of ${req.user.id}`, 404));
  }

  res.status(200).json({
    success: true,
    message: "Delete current user",
    data: user
  });
});



// @desc      Update user details
// @route     PUT /api/v1/auth/updatedetails
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Authentication Failed', 401));
  }

  const reqBody = await updateUserDetailsSchema(req.body);

  const existUser = await User.findOne({ email: reqBody.email });
  if (existUser && existUser.id !== req.user.id) {
    return next(new ErrorResponse('Email exists', 404));
  }

  const user = await User.findByIdAndUpdate(req.user.id, reqBody, {
    new: true,
    runValidators: true
  })

  if (!user) {
    return next(new ErrorResponse(`User not found with Id of ${req.user.id}`, 404));
  }

  res.status(200).json({
    success: true,
    message: "User details updated successfully",
    data: user
  });
});


// @desc      Update password
// @route     PUT /api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Authentication Failed', 401));
  }

  const reqBody = await updatePasswordSchema(req.body);

  const { currentPassword, newPassword } = reqBody;

  const user = await User.findById(req.user.id)
  if (!user) {
    return next(new ErrorResponse(`No User with the id of ${req.user.id}`, 404));
  };

  // Check current password
  if (!(await user.matchPassword(currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  };

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
    data: {}
  });

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
