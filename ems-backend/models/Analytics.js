// models/Analytics.js

const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  // The type of insight being stored
  insightType: {
    type: String,
    enum: ['employeePerformance', 'leaveTrends', 'attendanceInsights'],
    required: true
  },
  // Data for the specific insight type
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  // Period of the data (e.g., 'monthly', 'quarterly', 'yearly')
  period: {
    type: String,
    required: true
  },
  // Identifier for the period (e.g., '2024-08', 'Q3-2024', '2024')
  periodId: {
    type: String,
    required: true
  },
  // The date this data was last updated
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Analytics', analyticsSchema);
