const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

router.get('/dashboard', authenticateToken, async (req, res) => {
  const { role, userId } = req.user;

  try {
    if (role === 'admin') {
      const users = await User.find().select('-password -refreshTokens');
      const attendance = await Attendance.find();
      return res.status(200).json({
        message: 'Admin dashboard',
        role,
        users,
        attendance
      });
    }

    if (role === 'employee') {
      const profile = await Employee.findById(userId);
      const attendance = await Attendance.find({ user: userId });
      return res.status(200).json({
        message: 'Employee dashboard',
        role,
        profile,
        attendance
      });
    }

    if (role === 'manager') {
      return res.status(200).json({
        message: 'Manager dashboard',
        role,
        note: 'Manager-specific data can be added here'
      });
    }

    return res.status(403).json({ message: 'Access denied for this role' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;