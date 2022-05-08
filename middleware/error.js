const ErrorResponse = require("../utils/errorResponse.js");

const ErrorHandler = (error, request, response, next) => {
  // Mongoose bad ObjectId
  if (error.name === "CastError") {
    const message = "Resource not found";
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (error.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors).map((value) => value.message);
    error = new ErrorResponse(message, 400);
  }

  response
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Server Error" });
};

module.exports = ErrorHandler;
