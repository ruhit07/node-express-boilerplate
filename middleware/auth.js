const jwt = require('jsonwebtoken');
const { User } = require('../models/user.model');
const asyncHandler = require('./async');
const config = require('../config/config');
const ErrorResponse = require('../utils/errorResponse');

// 401 - Unauthorized, 403 - Forbidden

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } else {
    // Set token from cookie
    token = req.cookies.accessToken;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);

    req.user = await User.findByPk(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
exports.authorize = ([...roles]) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
