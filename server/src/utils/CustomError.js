// CustomError.js
class CustomError extends Error {
  constructor(message, statusCode, errorType) {
    console.log("message", message, statusCode, errorType);
    super(message);
    this.success = false;
    this.statusCode = statusCode;
    this.error = errorType; // Technical error identifier
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
