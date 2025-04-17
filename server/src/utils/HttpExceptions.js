const CustomError = require("./CustomError");

class BadRequestException extends CustomError {
  constructor(message = "Bad request") {
    console.log("here", message);
    super(message, 400, "BadRequest"); // Explicit error type
  }
}

class UnauthorizedException extends CustomError {
  constructor(message = "Unauthorized") {
    super(message, 401, "Unauthorized");
  }
}

class ForbiddenException extends CustomError {
  constructor(message = "Forbidden") {
    super(message, 403, "Forbidden");
  }
}

class NotFoundException extends CustomError {
  constructor(message = "Resource not found") {
    super(message, 404, "NotFound");
  }
}

class ConflictException extends CustomError {
  constructor(message = "Conflict detected") {
    super(message, 409, "Conflict");
  }
}

class InternalServerErrorException extends CustomError {
  constructor(message = "Internal server error") {
    super(message, 500, "InternalServerError");
  }
}

module.exports = {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
};
