// routes/attendance.js

const express              = require('express');
const router               = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const attendanceController = require('../controllers/attendanceController');

// Clock In
router.post(
  '/clock-in',
  authenticateToken,
  attendanceController.clockIn
);

// Clock Out
router.post(
  '/clock-out',
  authenticateToken,
  attendanceController.clockOut
);

// View monthly calendar
router.get(
  '/calendar',
  authenticateToken,
  attendanceController.getCalendar
);

module.exports = router;