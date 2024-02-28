const User = require("../models/user.model");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

//@desc    Get All Users
//@route   Get/api/v1/users
//access   private
exports.getUsers = asyncHandler(async (req, res, next) => {
  let query;

  // Copy query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort"]

  // Loop Over remove fields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create Oparetor ($gt,$gte,etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // Finding Resource
  query = User.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy)
  } else {
    query = query.sort("-cresteAt");
  }

  // Exscuting query
  const users = await query;

  res.status(200).json({
    success: true,
    message: `List of Users`,
    count: users.length,
    data: users
  });

});

//@desc    Get Single User
//@route   Get/api/v1/users/:id
//access   private
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

//@desc    Post Users 
//@route   Post/api/v1/users
//@access  private
exports.addUser = asyncHandler(async (req, res, next) => {
  // Add ser To Req.body
  req.body.user = req.user.id;

  // Check publish user
  const publishedUser = await User.findOne({ user: req.user.id });

  // If user is not a admin ,they can add only one user
  if (publishedUser && req.user.role !== "admin") {
    return next(new ErrorResponse(`The user with Id ${req.user.id} has already published a users`, 400));
  };

  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    message: `User created successfully`,
    data: user
  });

});

//@desc    Update Single User
//@route   Put/api/v1/users/:id
//@access  private
exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User Not Found With Id Of ${req.params.id}`, 404));
  }

  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    success: true,
    message: `User of id ${req.params.id} updated successfully`,
    data: user
  });

});

//@desc    Delete Single User
//@route   Delete/api/v1/users/:id
//access   private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User Not Found With Id Of ${req.params.id}`, 404));
  }

  user = await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: `User of id ${req.params.id} deleted successfully`,
    data: {}
  });

});