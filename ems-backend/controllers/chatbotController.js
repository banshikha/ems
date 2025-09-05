// controllers/chatbotController.js

const { createNotification } = require('./notificationController'); // A helper function from another controller
const ChatbotSession = require('../models/ChatbotSession'); // Assuming you have this model
const chatbotService = require('../services/chatbotService'); // Assuming a service for API calls to an LLM

/**
 * Handles user questions and provides answers from the AI chatbot.
 * POST /api/chatbot/ask
 */
exports.askChatbot = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message cannot be empty.' });
    }

    // You can implement logic here to check for common questions
    // before calling the LLM API to save costs or provide quick answers.
    const faqs = {
      'leave balance': 'You can check your leave balance on the Employee Panel under the Leave section.',
      'payslip download': 'Payslips can be downloaded from the Payroll section in your profile.',
      'hr policies': 'Please refer to the HR policies document available on the company intranet.'
    };

    let responseMessage;
    const lowercaseMessage = message.toLowerCase();

    if (faqs[lowercaseMessage]) {
      responseMessage = faqs[lowercaseMessage];
    } else {
      // If no direct FAQ match, call an external LLM service.
      // The chatbotService would handle the API call to a model like Gemini.
      // For this example, we will just use a mock response.
      responseMessage = await chatbotService.getResponseFromLLM(message);
    }
    
    // Save the conversation to the database for history and analytics.
    const session = await ChatbotSession.findOne({ user: userId });
    if (session) {
      session.conversation.push({ user: message, bot: responseMessage });
      await session.save();
    } else {
      await ChatbotSession.create({
        user: userId,
        conversation: [{ user: message, bot: responseMessage }]
      });
    }

    res.status(200).json({
      message: 'Chatbot response fetched successfully.',
      response: responseMessage
    });
  } catch (err) {
    next(err);
  }
};
