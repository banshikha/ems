// routes/chatbot.js

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const chatbotController = require('../controllers/chatbotController');

/**
 * @route POST /api/chatbot/ask
 * @desc Ask a question to the AI chatbot
 * @access Private
 */
router.post(
  '/ask',
  authenticateToken,
  chatbotController.askChatbot
);

module.exports = router;
