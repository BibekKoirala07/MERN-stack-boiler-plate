// CustomError.js
class CustomError extends Error {
  constructor(message, statusCode, errorType) {
    super(message);
    this.success = false;
    this.statusCode = statusCode;
    this.error = errorType;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
