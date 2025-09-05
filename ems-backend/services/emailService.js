// services/emailService.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // or another email service like SendGrid, Mailgun etc.
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Sends a single email notification.
 * This is a helper function to be called from other parts of the application.
 *
 * @param {string} to - The recipient's email address.
 * @param {string} subject - The email subject line.
 * @param {string} text - The plain text body of the email.
 * @param {string} [html] - The HTML body of the email.
 */
exports.sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      text,
      html
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error(`Failed to send email to ${to}:`, err.message);
  }
};
