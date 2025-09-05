// models/Performance.js

const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  deadline: Date,
  status: {
    type: String,
    enum: ['assigned', 'submitted', 'reviewed'],
    default: 'assigned'
  },
  progress: String,
  remarks: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Performance', performanceSchema);