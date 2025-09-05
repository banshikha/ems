// models/ChatbotSession.js

const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  bot: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const chatbotSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  conversation: [conversationSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('ChatbotSession', chatbotSessionSchema);
