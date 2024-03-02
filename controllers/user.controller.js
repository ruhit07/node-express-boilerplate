const User = require("../models/user.model");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const { updateUserSchema, createUserSchema } = require("../validation/user.validation");

// @desc    Get All Users
// @route   Get/api/v1/users
// access   private
exports.getUsers = asyncHandler(async (req, res, next) => {

  const { name, email } = req.query;

  const reqQuery = {};
  if (name) reqQuery.name = name;
  if (email) reqQuery.email = email;

  const users = await User.find(reqQuery);

  res.status(200).json({
    success: true,
    message: `List of Users`,
    count: users.length,
    data: users
  });

});

// @desc    Get Single User
// @route   Get/api/v1/users/:id
// access   private
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User Not Found With Id Of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    message: `User of id ${req.params.id}`,
    data: user
  });

});

// @desc    Post Users 
// @route   Post/api/v1/users
// @access  private
exports.addUser = asyncHandler(async (req, res, next) => {
  const reqBody = await createUserSchema(req.body);

  const user = await User.create(reqBody);

  res.status(201).json({
    success: true,
    message: `User created successfully`,
    data: user
  });

});

// @desc    Update Single User
// @route   Put/api/v1/users/:id
// @access  private
exports.updateUser = asyncHandler(async (req, res, next) => {

  const reqBody = await updateUserSchema(req.body);

  const user = await User.findByIdAndUpdate(req.params.id, reqBody, {
    new: true,
    runValidators: true
  })

  if (!user) {
    return next(new ErrorResponse(`User Not Found With Id Of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    message: `User of id ${req.params.id} updated successfully`,
    data: user
  });

});

// @desc    Delete Single User
// @route   Delete/api/v1/users/:id
// access   private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User Not Found With Id Of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    message: `User of id ${req.params.id} deleted successfully`,
    data: {}
  });
});