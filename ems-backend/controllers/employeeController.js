// controllers/employeeController.js

const Employee     = require('../models/Employee');
const LeaveRequest = require('../models/LeaveRequest');

// GET /api/employee/profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await Employee.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ profile: user });
  } catch (err) {
    next(err);
  }
};

// POST /api/employee/apply-leave
exports.applyLeave = async (req, res, next) => {
  try {
    const { from, to, reason } = req.body;
    if (!from || !to || !reason) {
      return res
        .status(400)
        .json({ message: 'from, to and reason are required' });
    }

    const leave = await LeaveRequest.create({
      user:   req.user.userId,
      from,
      to,
      reason,
      status: 'pending'
    });

    res.status(201).json({ message: 'Leave applied', leave });
  } catch (err) {
    next(err);
  }
};

// PUT /api/employee/update-details
exports.updateDetails = async (req, res, next) => {
  try {
    const updates = req.body;
    const user    = await Employee.findByIdAndUpdate(
      req.user.userId,
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Details updated', user });
  } catch (err) {
    next(err);
  }
};