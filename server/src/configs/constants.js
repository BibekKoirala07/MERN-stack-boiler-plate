require("dotenv").config();

exports.AUTH_CONFIG = {
  // Toggle whether email verification is needed after registration
  ENABLE_EMAIL_VERIFICATION: process.env.ENABLE_EMAIL_VERIFICATION === "true",

  // Toggle whether user should be auto-logged in after registration
  AUTO_LOGIN_AFTER_REGISTER: process.env.AUTO_LOGIN_AFTER_REGISTER === "true",

  // Toggle whether email sending (verification or reset) is enabled
  ENABLE_EMAIL_SENDING: process.env.ENABLE_EMAIL_SENDING === "true",

  // Enable or disable password reset functionality
  ENABLE_PASSWORD_RESET: process.env.ENABLE_PASSWORD_RESET === "true",

  // JWT token expiration duration
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",

  // Login throttling options
  //   ENABLE_LOGIN_THROTTLE: process.env.ENABLE_LOGIN_THROTTLE === "true",
  //   MAX_LOGIN_ATTEMPTS: 5,
  //   LOCK_TIME_MINUTES: 15,

  // Device tracking (optional)
  //   ENABLE_DEVICE_TRACKING: true,
};
