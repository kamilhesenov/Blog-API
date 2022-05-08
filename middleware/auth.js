const jwt = require("jsonwebtoken");
const asyncHandler = require("./async.js");
const ErrorResponse = require("../utils/errorResponse.js");
const User = require("../models/User.js");

// Protect routes
const protect = asyncHandler(async (request, response, next) => {
  let token;

  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = request.headers.authorization.split(" ")[1];
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECURITY);

    request.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return next(new ErrorResponse("Not authorize to access this route", 401));
  }
});

module.exports = protect;
