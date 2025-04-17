const { AUTH_CONFIG } = require("../configs/constants");
const UserModel = require("../models/user.model");
const catchAsyncError = require("../utils/catchAsyncError");
const { transporter } = require("../utils/emails");
const crypto = require("crypto");

const {
  ConflictException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} = require("../utils/HttpExceptions");

exports.registerController = catchAsyncError(async (req, res, next) => {
  const user = await UserModel.create(req.validatedBody);

  const { email } = req.validatedBody;

  if (AUTH_CONFIG.ENABLE_EMAIL_VERIFICATION) {
    const verificationToken = user.generateEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${email}/${verificationToken}`;
    const mailOptions = {
      from: `"Support" <${process.env.NODEMAILER_SENDING_EMAIL_TO}>`,
      to: user.email,
      subject: "Verify Your Email",
      html: `<p>Hello ${user.name},</p>
             <p>Click below to verify your email:</p>
             <a href="${verifyUrl}">${verifyUrl}</a>`,
    };
    await transporter.sendMail(mailOptions);
    return res.status(201).json({
      success: true,
      message: "User registered. Please verify your email.",
      url: verifyUrl,
    });
  }
  if (AUTH_CONFIG.AUTO_LOGIN_AFTER_REGISTER) {
    console.log("here");
    const token = await user.generateJWT();
    return res.status(201).json({
      success: true,
      message: "User registered and logged in.",
      token,
      data: user,
    });
  }
  // this would tell the user to go to login.
  return res.status(201).json({
    success: true,
    message: "User registered. Login to gain access.",
  });
});

exports.loginController = catchAsyncError(async (req, res) => {
  const { email, password } = req.validatedBody;

  console.log("req.validteBody", req.validatedBody);

  const user = await UserModel.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new UnauthorizedException("Invalid credentials");
  }

  if (AUTH_CONFIG.ENABLE_EMAIL_VERIFICATION && !user.isEmailVerified) {
    throw new ForbiddenException("Email not verified. Re register to login");
  }

  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  const token = user.generateJWT();
  res.status(200).json({ success: true, token, data: user });
});

exports.resendEmailVerificationController = catchAsyncError(
  async (req, res) => {
    const { email } = forgotPasswordSchema.parse(req.body);
    const user = await UserModel.findOne({ email });
    if (!user) throw new NotFoundException("User not found");

    if (user.isEmailVerified) {
      throw new ConflictException("Email is already verified");
    }

    const resetPasswordToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const verifyUrl = `${process.env.CLIENT_URL}/auth/verify-email/${email}/${resetPasswordToken}`;
    const mailOptions = {
      from: `"Support" <${process.env.NODEMAILER_SENDING_EMAIL_TO}>`,
      to: user.email,
      subject: "Resending the request password email",
      html: `<p>Hello ${user.name},</p>
             <p>Click below to get reset password link:</p>
             <a href="${verifyUrl}">${verifyUrl}</a>`,
    };

    await transporter.sendMail(mailOptions);

    return res
      .status(200)
      .json({ success: true, message: "The resend email has been sent" });
  }
);

exports.verifyEmailController = catchAsyncError(async (req, res, next) => {
  const { email, token } = req.validatedParams;

  console.log("email", token);

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await UserModel.findOne({
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
  res.status(200).json({ success: true, message: "You have been verified" });
});

exports.forgotPasswordController = catchAsyncError(async (req, res) => {
  const { email } = req.validatedBody;

  console.log("req", req.validatedBody);

  const user = await UserModel.findOne({ email });
  if (!user) throw new NotFoundException("User not found");

  const resetPasswordToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  console.log("resetPasswordTone", resetPasswordToken);

  const verifyUrl = `${process.env.CLIENT_URL}/auth/verify-email/${email}/${resetPasswordToken}`;
  const mailOptions = {
    from: `"Support" <${process.env.NODEMAILER_SENDING_EMAIL_TO}>`,
    to: user.email,
    subject: "Frogot Password email",
    html: `<p>Hello ${user.name},</p>
             <p>Click below to get reset password link:</p>
             <a href="${verifyUrl}">${verifyUrl}</a>`,
  };

  await transporter.sendMail(mailOptions);

  res.status(200).json({ success: true, message: "The email has been sent" });
});

// ─── RESEND EMAIL VERIFICATION ────

exports.resetPasswordController = catchAsyncError(async (req, res) => {
  const { token, password } = resetPasswordSchema.parse(req.body);

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await UserModel.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user)
    throw new BadRequestException("Invalid or expired password reset token");

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return res.status(201).json({
    success: true,
    message: "The password has been reseted Now login to gain access",
  });
});

exports.resendForgotPasswordController = catchAsyncError(async (req, res) => {
  const { email } = req.validatedBody;

  console.log("req", req.validatedBody);

  const user = await UserModel.findOne({ email });
  if (!user) throw new NotFoundException("User not found");

  const resetPasswordToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const verifyUrl = `${process.env.CLIENT_URL}/auth/verify-email/${email}/${resetPasswordToken}`;
  const mailOptions = {
    from: `"Support" <${process.env.NODEMAILER_SENDING_EMAIL_TO}>`,
    to: user.email,
    subject: "Resending forgot passowrd email",
    html: `<p>Hello ${user.name},</p>
             <p>Click below to get reset password link:</p>
             <a href="${verifyUrl}">${verifyUrl}</a>`,
  };

  await transporter.sendMail(mailOptions);

  res.status(200).json({ success: true, message: "The email has been sent" });
});

exports.deleteAccountController = catchAsyncError(async (req, res, next) => {
  const { email } = req.validatedBody;
});
