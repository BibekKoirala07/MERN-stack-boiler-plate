const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_SENDING_EMAIL_TO,
    pass: process.env.NODEMAILER_SENDING_EMAIL_APPPASSWORD,
  },
});

module.exports = { transporter };

// const sendToOneMailOption = {
//   from: email,
//   to: process.env.NODEMAILER_SENDING_EMAIL_TO,
//   subject: "New Message from my site",
//   text: `You have a new message from ${username} (${email}):\n\n${message}`, // Fallback text
//   html: `
//     <html>
//       <body style="font-family: Arial, sans-serif; line-height: 1.5; margin: 20px;">
//         <h2 style="color: #333;">You have a new message from your site!</h2>
//         <p><strong>Name:</strong> ${username}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Message:</strong></p>
//         <p style="border: 1px solid #ccc; padding: 10px; border-radius: 5px; background-color: #f9f9f9;">
//           ${message}..
//         </p>
//         <p style="color: #777;">This message was sent from your contact form.</p>
//       </body>
//     </html>
//   `,
// };
