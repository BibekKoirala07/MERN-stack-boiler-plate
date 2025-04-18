const nodemailer = require("nodemailer");

console.log("here", process.env.NODEMAILER_HOST);

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_SENDING_EMAIL_TO,
    pass: process.env.NODEMAILER_SENDING_EMAIL_APPPASSWORD,
  },
});

const sendAuthVerificationEmail = async (user) => {
  const verificationToken = user.generateEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  const verifyUrl = `${process.env.CLIENT_FRONTEND_URL}/auth/verify-email?email=${user.email}&token=${verificationToken}`;
  const mailOptions = {
    from: `"Support" <${process.env.NODEMAILER_SENDING_EMAIL_TO}>`,
    to: user.email,
    subject: "Verify Your Email",
    html: `<p>Hello ${user.name},</p>
               <p>Click below to verify your email:</p>
               <a href="${verifyUrl}">${verifyUrl}</a>`,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { transporter, sendAuthVerificationEmail };
