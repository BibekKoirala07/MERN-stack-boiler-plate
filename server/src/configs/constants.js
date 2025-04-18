require("dotenv").config();

exports.CONFIG = {
  ENABLE_EMAIL_VERIFICATION: process.env.ENABLE_EMAIL_VERIFICATION === "true",

  AUTO_LOGIN_AFTER_REGISTER: process.env.AUTO_LOGIN_AFTER_REGISTER === "true",

  PORT: process.env.PORT || 8000,
  JWT_SECRET: process.env.JWT_SECRET || "my-secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
};
