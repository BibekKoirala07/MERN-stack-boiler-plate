const express = require("express");

const {
  registerSchema,
  loginSchema,
  verifyEmailParamsSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("./dtos/auth.dto");

const rateLimiter = require("../middlewares/rateLimiter");
const validateBodySchema = require("../validations/validateBodySchema");

const {
  registerController,
  loginController,
  verifyEmailController,
  forgotPasswordController,

  resetPasswordController,
  deleteAccountController,
} = require("./auth.Controller");
const validateQuerySchema = require("../validations/validateQuerySchema");
const authRoutes = express.Router();

authRoutes.post(
  "/register",
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
  }),
  validateBodySchema(registerSchema),
  registerController
);

authRoutes.post(
  "/login",
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
  }),
  validateBodySchema(loginSchema),
  loginController
);

authRoutes.get(
  "/verify-email",
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 7,
  }),
  validateQuerySchema(verifyEmailParamsSchema),
  verifyEmailController
);

authRoutes.post(
  "/forgot-password/request-email",
  rateLimiter({
    windowMs: 2 * 60 * 1000, // 3 time every two minutes
    max: 3,
  }),
  validateBodySchema(forgotPasswordSchema),
  forgotPasswordController
);

authRoutes.post(
  "/reset-password",
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
  }),
  validateBodySchema(resetPasswordSchema),
  resetPasswordController
);

module.exports = authRoutes;
