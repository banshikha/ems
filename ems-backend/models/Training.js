// models/Training.js

const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Could be 'admin' or 'manager' role
    required: true
  },
  targetAudience: {
    type: [String], // e.g., ['intern', 'employee']
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  resources: {
    type: [String], // URLs or file paths to training materials
    default: []
  },
  // Users who have completed the training
  completedBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    completionDate: {
      type: Date,
      default: Date.now
    }
  }],
}, {
  timestamps: true
});

module.exports = mongoose.model('Training', trainingSchema);
