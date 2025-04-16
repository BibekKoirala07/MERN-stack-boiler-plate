const CustomError = require("./CustomError");

class NotFoundException extends CustomError {
  constructor(message = "Resource not found") {
    console.log("message", message);
    super(message, 404);
  }
}

class BadRequestException extends CustomError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}

module.exports = { NotFoundException, BadRequestException };
