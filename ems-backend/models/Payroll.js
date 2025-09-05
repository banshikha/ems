//Payroll.js
// models/Payroll.js

const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  grossSalary: {
    type: Number,
    required: true,
  },
  deductions: {
    tax: { type: Number, default: 0 },
    providentFund: { type: Number, default: 0 },
    // Add other deductions as needed
  },
  netSalary: {
    type: Number,
    required: true
  },
  payslipGenerated: {
    type: Boolean,
    default: false
  },
  payslipUrl: {
    type: String
  }
}, {
  timestamps: true
});

// A compound index to ensure one payroll record per user per month/year
payrollSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Payroll', payrollSchema);
