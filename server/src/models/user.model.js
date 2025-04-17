const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { AUTH_CONFIG } = require("../configs/constants");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],

      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },
    rawPassword: {},
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    isEmailVerified: {
      type: Boolean,
      default: !AUTH_CONFIG.ENABLE_EMAIL_VERIFICATION,
    },
    emailVerificationToken: String,
    emailVerificationTokenExpires: Date,

    resetPasswordToken: String,
    resetPasswordExpires: Date,

    lastLogin: Date,

    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },

    devices: [
      {
        deviceId: String,
        userAgent: String,
        lastUsedAt: Date,
      },
    ],

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.rawPassword = this.get("password");
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJWT = function () {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    "my-secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );
};

userSchema.methods.generateEmailVerificationToken = function () {
  const rawToken = crypto.randomBytes(20).toString("hex");
  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  this.emailVerificationTokenExpires = Date.now() + 30 * 60 * 1000;
  return rawToken;
};

userSchema.methods.generatePasswordResetToken = function () {
  const rawToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  this.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
  return rawToken;
};

userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

userSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { deletedAt: null },
  }
);

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
