// models/User.js

const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const userSchema = new mongoose.Schema({
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
  role: {
    type: String,
    enum: ['admin', 'manager', 'employee', 'intern'],
    default: 'employee'
  },
  password: {
    type: String,
    required: true
  },

  refreshTokens: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});



// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt       = await bcrypt.genSalt(10);
  this.password    = await bcrypt.hash(this.password, salt);
  next();
});

// Compare plain text password with the hashed one
// (Renamed to match most controllers’ `comparePassword` use)
userSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Strip out sensitive fields on JSON output
userSchema.set('toJSON', {
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.refreshTokens;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);