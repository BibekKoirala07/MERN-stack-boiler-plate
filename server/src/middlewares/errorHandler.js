const {
  BadRequestException,
  ConflictException,
} = require("../utils/errors/HttpExceptions");

const errorHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    err = new BadRequestException(
      Object.values(err.errors)[0]?.message || "Invalid input data"
    );
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    err = new ConflictException(`${field} already exists.`);
  }

  if (err.name === "CastError") {
    err = new BadRequestException(`Invalid ${err.path}: ${err.value}`);
  }

  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
    error: err.error || "InternalServerError",
    statusCode,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;
