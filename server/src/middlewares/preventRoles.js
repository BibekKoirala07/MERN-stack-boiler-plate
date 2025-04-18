const { ForbiddenException } = require("../utils/HttpExceptions");

function preventRoles(...rolesToBlock) {
  return (req, res, next) => {
    if (rolesToBlock.includes(req.user.role)) {
      throw new ForbiddenException(
        `Role '${req.user.role}' is not allowed to access this resource`
      );
    }
    next();
  };
}

module.exports = preventRoles;
