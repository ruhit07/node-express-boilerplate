const ErrorResponse = require('../utils/errorResponse');

// 400-Bad Request, 404-Not Found, 500-Internal Server Error

const errorHandler = async (err, req, res, next) => {
  let error = { ...err }, errors = {};

  error.message = err.message;

  // Log to console for dev
  console.log(`${err}`.red);

  if (req.originalUrl === '/api/v1/auth/login') {
    Object.entries(req.cookies).forEach(([key, value]) => res.clearCookie(key));
  }

  // custom errors
  if (err.customErrors) {
    errors = err.customErrors;
  }

  // custom errors handled using joi
  if (err.JoiValidationError) {
    err.JoiValidationError.details.forEach(({ path, message }) => errors[path] = message);
    error = new ErrorResponse("Validation Error", 400);
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    err.errors.forEach(error => errors[error.path] = error.message);
    error = new ErrorResponse(message, 400)
  };

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    error = new ErrorResponse(`Resource not found`, 404)
  };

  // Mongoose Duplicate Key
  if (err.code === 11000) {
    error = new ErrorResponse(`Duplicate Value Entered`, 400)
  };

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    errors
  });
};

module.exports = errorHandler;