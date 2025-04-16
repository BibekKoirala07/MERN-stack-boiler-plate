class CustomError extends Error {
  constructor(message, statusCode) {
    console.log("message statusCode", message, statusCode);
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
