// routes/performance.js

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleCheck');
const {
  assignTask,
  getInternTasks,
  submitInternReport
} = require('../controllers/performanceController');

// Manager assigns task
router.post(
  '/manager/assign',
  authenticateToken,
  authorizeRoles('manager'),
  assignTask
);

// Intern views tasks
router.get(
  '/intern/view-tasks',
  authenticateToken,
  authorizeRoles('intern'),
  getInternTasks
);

// Intern submits report
router.post(
  '/intern/submit-report',
  authenticateToken,
  authorizeRoles('intern'),
  submitInternReport
);

module.exports = router;