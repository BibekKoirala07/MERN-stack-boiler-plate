const { BadRequestException } = require("../utils/HttpExceptions");

const validateParamsSchema = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.params);
  if (!result.success) {
    const message =
      result.error.errors[0]?.message || "Invalid request parameters";
    return next(new BadRequestException(message));
  }
  req.validatedParams = result.data;
  next();
};

module.exports = validateParamsSchema;
