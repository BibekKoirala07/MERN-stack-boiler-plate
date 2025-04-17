const rateLimit = require("express-rate-limit");

function rateLimiter({ windowMs, max, message }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: message || "Too many requests, please try again later.",
      error: "TooManyRequests",
      statusCode: 429,
    },
  });
}

module.exports = rateLimiter;
