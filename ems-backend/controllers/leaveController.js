// controllers/leaveController.js

const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');

/**
 * Approve a leave request (Manager only)
 * PUT /api/manager/approve-leave/:id
 */
exports.approveLeave = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, managerComment } = req.body;
    const managerId = req.user.userId;

    // Find the leave request
    const leave = await LeaveRequest.findById(id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found.' });
    }

    // Check if the approving user is the assigned manager of the requesting user
    const requestingUser = await User.findById(leave.user);
    // Assuming a 'manager' field exists on the User model
    if (!requestingUser || requestingUser.manager.toString() !== managerId) {
      return res.status(403).json({ message: 'Forbidden: You are not authorized to approve this leave request.' });
    }

    // Update status and approvedBy field
    if (status && ['approved', 'rejected'].includes(status)) {
      leave.status = status;
      leave.approvedBy = managerId;
      leave.managerComment = managerComment || '';
    } else {
      return res.status(400).json({ message: 'Invalid status provided.' });
    }

    await leave.save();
    res.status(200).json({
      message: 'Leave request updated successfully.',
      leave
    });

  } catch (err) {
    next(err);
  }
};

/**
 * Get all leave requests for a manager's team
 * GET /api/manager/leave-requests
 * This is a new function added to complete the manager panel functionality.
 */
exports.getLeaveRequests = async (req, res, next) => {
  try {
    const managerId = req.user.userId;

    // Find all users who report to this manager
    const teamMembers = await User.find({ manager: managerId }).select('_id');
    const teamMemberIds = teamMembers.map(member => member._id);

    // Find all leave requests from those team members
    const leaveRequests = await LeaveRequest.find({
      user: { $in: teamMemberIds }
    }).populate('user', 'name email role'); // Populate user details for the frontend

    res.status(200).json({
      message: 'Leave requests fetched successfully.',
      requests: leaveRequests
    });
  } catch (err) {
    next(err);
  }
};
