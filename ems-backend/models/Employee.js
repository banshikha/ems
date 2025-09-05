// models/Employee.js

const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin','manager','employee','intern'],
    default: 'employee'
  },
  department: {
    type: String,
    default: ''
  },
  refreshTokens: {
    type: [String],
    default: []
  }
}, { 
  timestamps: true 
});

// Compound index on email for fast lookups
employeeSchema.index({ email: 1 });

// Hash password on create/update
employeeSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt    = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare candidate password to stored hash
employeeSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Strip out sensitive fields when converting to JSON
employeeSchema.set('toJSON', {
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.refreshTokens;
    return ret;
  }
});

module.exports = mongoose.model('Employee', employeeSchema);