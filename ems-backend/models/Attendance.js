// models/Attendance.js

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',            // or 'Employee' if that’s your model
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  clockIn: Date,
  clockOut: Date
}, {
  timestamps: true
});

// compound index for user + date queries
attendanceSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);