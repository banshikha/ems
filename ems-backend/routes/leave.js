// routes/leave.js

const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const leaveController = require('../controllers/leaveController');
const employeeController = require('../controllers/employeeController'); // Assuming applyLeave is here

// Employee applies for leave
// POST /api/leave/apply
router.post(
  '/apply',
  authenticateToken,
  authorizeRoles('employee', 'intern'),
  employeeController.applyLeave // Using the existing controller function
);

// Manager approves or rejects a leave request
// PUT /api/leave/approve/:id
router.put(
  '/approve/:id',
  authenticateToken,
  authorizeRoles('manager', 'admin'),
  leaveController.approveLeave
);

// Manager views all pending leave requests for their team
// GET /api/leave/manager-requests
router.get(
  '/manager-requests',
  authenticateToken,
  authorizeRoles('manager', 'admin'),
  leaveController.getLeaveRequests
);

module.exports = router;
