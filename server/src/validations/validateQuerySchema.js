const { BadRequestException } = require("../utils/errors/HttpExceptions");

const validateQuerySchema = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.query);
  console.log("result", result);
  if (!result.success) {
    const message =
      result.error.errors[0]?.message || "Invalid query parameters";
    return next(new BadRequestException(message));
  }
  req.validatedQuery = result.data;
  next();
};

module.exports = validateQuerySchema;
