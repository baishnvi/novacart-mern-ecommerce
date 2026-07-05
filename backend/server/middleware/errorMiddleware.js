const ApiError = require("../utils/ApiError");

const notFound = (req, res, next) => {
  const error = ApiError.notFound(`Route not found - ${req.originalUrl}`);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || 500;
    let message = error.message || "Internal Server Error";
    let errors = [];

    if (error.name === "CastError") {
      statusCode = 400;
      message = `Invalid ${error.path}: ${error.value}`;
    }

    if (error.code === 11000) {
      statusCode = 409;
      const field = Object.keys(error.keyValue || {})[0];
      message = `Duplicate value for field: ${field}`;
    }

    if (error.name === "ValidationError") {
      statusCode = 400;
      errors = Object.values(error.errors).map((e) => e.message);
      message = "Validation failed";
    }

    if (error.name === "JsonWebTokenError") {
      statusCode = 401;
      message = "Invalid token";
    }

    if (error.name === "TokenExpiredError") {
      statusCode = 401;
      message = "Token expired";
    }

    error = new ApiError(statusCode, message, errors, error.stack);
  }

  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  return res.status(error.statusCode).json({
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors || [],
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};

module.exports = { notFound, errorHandler };
