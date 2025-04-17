const express = require("express");
const {
  forgotPasswordController,
  loginController,
  resetPasswordController,
  verifyEmailController,

  registerController,
  deleteAccountController,
  resendForgotPasswordController,
  resendEmailVerificationController,
} = require("./auth.controller");

const {
  registerSchema,
  loginSchema,
  verifyEmailParamsSchema,
  forgotPasswordSchema,
} = require("./dtos/auth.dto");
const validateBodySchema = require("../middlewares/validateBodySchema");
const validateParamsSchema = require("../middlewares/validateParamsSchema");
const rateLimiter = require("../middlewares/rateLimiter");
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
  "/verify-email/:email/:token",
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
  }),
  validateParamsSchema(verifyEmailParamsSchema),
  verifyEmailController
);

authRoutes.get(
  "/verify-email/resend/:email/:token",
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
  }),
  validateParamsSchema(verifyEmailParamsSchema),
  resendEmailVerificationController
);

authRoutes.post(
  "/forgot-password/request-email",
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
  }),
  validateBodySchema(forgotPasswordSchema),
  forgotPasswordController
);

authRoutes.post(
  "/forgot-password/resend-request-email",
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
  }),
  validateBodySchema(forgotPasswordSchema),
  resendForgotPasswordController
);

authRoutes.post(
  "/reset-password",
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 5,
  }),
  resetPasswordController
);

// authRoutes.post(
//   "/account/restore",
//   // authenticate,
//   // isAdmin,
//   validateBodySchema(forgotPasswordSchema),
//   restore
// );

authRoutes.delete(
  "/account",
  // authenticate,
  deleteAccountController
);

module.exports = authRoutes;
