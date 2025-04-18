const UserModel = require("../models/user.model");
const catchAsyncError = require("../utils/errors/catchAsyncError");
const {
  transporter,

  sendAuthVerificationEmail,
} = require("../utils/email/emails");
const crypto = require("crypto");

const {
  ConflictException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  InternalServerErrorException,
} = require("../utils/errors/HttpExceptions");
const handleUnverifiedUser = require("../utils/auth/handleUnverifiedUsers");
const { CONFIG } = require("../configs/constants");

exports.registerController = catchAsyncError(async (req, res, next) => {
  const { email } = req.validatedBody;

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    if (existingUser.deletedAt) {
      throw new NotFoundException(
        "This resource is deleted. You aren't permitted to use it."
      );
    }

    if (CONFIG.ENABLE_EMAIL_VERIFICATION && !existingUser.isEmailVerified) {
      const handled = await handleUnverifiedUser(existingUser, res, next);
      if (handled) return;
    }

    throw new BadRequestException("Email is already registered.");
  }

  const user = await UserModel.create(req.validatedBody);

  if (CONFIG.ENABLE_EMAIL_VERIFICATION) {
    const handled = await handleUnverifiedUser(user, res, next);
    if (handled) return;
  }
  if (CONFIG.AUTO_LOGIN_AFTER_REGISTER) {
    const token = await user.generateJWT();
    return res.status(201).json({
      success: true,
      message: "User registered and logged in.",
      token,
      data: user,
    });
  }

  return res.status(201).json({
    success: true,
    message: "User registered. Login to gain access.",
  });
});

exports.loginController = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.validatedBody;

  const user = await UserModel.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new UnauthorizedException("Invalid credentials");
  }

  if (CONFIG.ENABLE_EMAIL_VERIFICATION && !user.isEmailVerified) {
    const handled = await handleUnverifiedUser(existingUser, res, next);
    if (handled) return;
  }

  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  const token = user.generateJWT();
  res.status(200).json({ success: true, token, data: user });
});

exports.verifyEmailController = catchAsyncError(async (req, res, next) => {
  const { email, token } = req.validatedQuery;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await UserModel.findOne({
    email,
    emailVerificationToken: hashedToken,
    emailVerificationTokenExpires: { $gt: Date.now() },
  });

  if (!user)
    return next(
      new BadRequestException("Invalid or expired email verification token")
    );

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpires = undefined;

  await user.save({ validateBeforeSave: false });
  res
    .status(200)
    .json({ success: true, message: "You have been verified. Login Now" });
});

exports.forgotPasswordController = catchAsyncError(async (req, res, next) => {
  const { email } = req.validatedBody;

  const user = await UserModel.findOne({ email });
  if (!user) throw new NotFoundException("User not found");

  if (CONFIG.ENABLE_EMAIL_VERIFICATION && !user.isEmailVerified) {
    const handled = await handleUnverifiedUser(existingUser, res, next);
    if (handled) return;
  }

  const now = Date.now();
  const timeDifference = now - user.lastForgotPasswordRequestAt?.getTime();

  if (user.lastForgotPasswordRequestAt && timeDifference < 2 * 60 * 1000) {
    const secondsLeft = Math.ceil((2 * 60 * 1000 - timeDifference) / 1000);
    return next(
      new BadRequestException(
        `Please wait ${secondsLeft}s before trying again.`
      )
    );
  }

  const resetPasswordToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const verifyUrl = `${process.env.CLIENT_FRONTEND_URL}/auth/reset-password?email=${email}&token=${resetPasswordToken}`;
  const mailOptions = {
    from: `"Support" <${process.env.NODEMAILER_SENDING_EMAIL_TO}>`,
    to: user.email,
    subject: "Forgot Password Email",
    html: `<p>Hello ${user.name},</p>
             <p>Click below to get the reset password link:</p>
             <a href="${verifyUrl}">${verifyUrl}</a>`,
  };

  await transporter.sendMail(mailOptions);

  user.lastForgotPasswordRequestAt = new Date();
  await user.save();

  res.status(200).json({ success: true, message: "The email has been sent." });
});

exports.resetPasswordController = catchAsyncError(async (req, res) => {
  const { email, token, newPassword } = req.validatedBody;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await UserModel.findOne({
    email,
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user)
    throw new BadRequestException("Invalid or expired password reset token");

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
  return res.status(201).json({
    success: true,
    message: "The password has been reseted Now login to gain access",
  });
});

exports.deleteAccountController = catchAsyncError(async (req, res, next) => {
  const { email } = req.validatedBody;
});
