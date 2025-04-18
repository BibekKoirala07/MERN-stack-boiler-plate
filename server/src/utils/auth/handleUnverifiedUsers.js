const { sendAuthVerificationEmail } = require("../email/emails");

const handleUnverifiedUser = async (user, res, next) => {
  if (!user.isEmailVerified) {
    try {
      await sendAuthVerificationEmail(user);
      res.status(200).json({
        success: true,
        message: "Email not verified. We've resent the verification link.",
      });
      return true;
    } catch (err) {
      return next(
        new InternalServerErrorException("Failed to send verification email.")
      );
    }
  }
  return false;
};

module.exports = handleUnverifiedUser;
