const { BadRequestException } = require("../utils/errors/HttpExceptions");

const validateBodySchema = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    console.log("request errors", result.error);
    const firstError = result.error.errors[0];
    return next(
      new BadRequestException(firstError?.message || "Invalid request body")
    );
  }

  req.validatedBody = result.data;
  next();
};

module.exports = validateBodySchema;
