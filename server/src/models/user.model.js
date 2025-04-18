const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { CONFIG } = require("../configs/constants");

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
      unique: true,
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
      default: !CONFIG.ENABLE_EMAIL_VERIFICATION,
    },
    emailVerificationToken: String,
    emailVerificationTokenExpires: Date,

    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastForgotPasswordRequestAt: {
      type: Date,
      default: null,
    },

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

userSchema.virtual("isDeleted").get(function () {
  return this.deletedAt !== null;
});

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
    CONFIG.JWT_SECRET,
    { expiresIn: CONFIG.JWT_EXPIRES_IN }
  );
};

userSchema.methods.generateEmailVerificationToken = function () {
  const rawToken = crypto.randomBytes(45).toString("hex");
  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
  this.emailVerificationTokenExpires = Date.now() + 30 * 60 * 1000;
  return rawToken;
};

userSchema.methods.generatePasswordResetToken = function () {
  const rawToken = crypto.randomBytes(45).toString("hex");
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

// Soft delete middleware - Update deletedAt field instead of actual deletion
userSchema.pre(
  /^findOneAndDelete|findByIdAndDelete|^delete/,
  async function (next) {
    // Set the deletedAt field instead of deleting the record
    this.set({ deletedAt: new Date() });
    next();
  }
);

// automatically include deletedAt : null at all the find query
userSchema.pre(/^find/, function (next) {
  // Automatically exclude soft-deleted users for all find queries
  this.where({ deletedAt: null });
  next();
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
