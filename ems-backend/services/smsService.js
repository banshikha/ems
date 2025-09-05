// services/smsService.js
// This file assumes a service like Twilio or an alternative SMS API.

// For demonstration purposes, we will use a mock function.
// In a real application, you would require and configure your SMS client here.
// const twilio = require('twilio');
// const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * Sends a single SMS notification.
 * This is a helper function to be called from other parts of the application.
 *
 * @param {string} to - The recipient's phone number.
 * @param {string} body - The body of the SMS message.
 */
exports.sendSMS = async (to, body) => {
  try {
    // In a real implementation, you would call the SMS API here.
    // await client.messages.create({
    //   body: body,
    //   to: to,
    //   from: process.env.TWILIO_PHONE_NUMBER
    // });
    
    // For now, we will just log the message to the console.
    console.log(`SMS sent to ${to}: "${body}"`);
    console.log("Note: This is a mock function. Replace with a real SMS service implementation.");

  } catch (err) {
    console.error(`Failed to send SMS to ${to}:`, err.message);
  }
};
