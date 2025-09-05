// models/Offboarding.js

const mongoose = require('mongoose');

const offboardingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Ensure only one offboarding record per user
  },
  resignationDate: {
    type: Date,
    required: true
  },
  lastWorkingDate: {
    type: Date,
    required: true
  },
  reasonForLeaving: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  clearanceStatus: {
    hr: { type: Boolean, default: false },
    it: { type: Boolean, default: false },
    finance: { type: Boolean, default: false },
    manager: { type: Boolean, default: false }
  },
  relievingLetterGenerated: {
    type: Boolean,
    default: false
  },
  experienceLetterGenerated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Offboarding', offboardingSchema);
