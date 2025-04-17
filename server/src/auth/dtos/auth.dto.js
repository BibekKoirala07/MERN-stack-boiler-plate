const { z } = require("zod");

const emailField = z.string().email("Invalid email address");
const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(15, "Password can't exceed 15 characters");
const nameField = z.string().min(3, "Name is required");
const tokenField = z.string().min(10, "Token is required");

const registerSchema = z
  .object({
    name: nameField,
    email: emailField,
    password: passwordField,
  })
  .strict();

const loginSchema = z
  .object({
    email: emailField,
    password: passwordField,
  })
  .strict();

const verifyEmailParamsSchema = z.object({
  email: z.string().email("Invalid email"),
  token: z.string().min(10, "Invalid or missing token"),
});

const forgotPasswordSchema = z
  .object({
    email: emailField,
  })
  .strict();

const resetPasswordSchema = z
  .object({
    token: tokenField,
    password: passwordField,
    newPassword: passwordField,
  })
  .strict();

module.exports = {
  registerSchema,
  loginSchema,
  verifyEmailParamsSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
