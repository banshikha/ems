// routes/analytics.js

const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const analyticsController = require('../controllers/analyticsController');

/**
 * @route GET /api/analytics/dashboard
 * @desc Get the latest analytics data for the admin dashboard
 * @access Admin
 */
router.get(
  '/dashboard',
  authenticateToken,
  authorizeRoles('admin'),
  analyticsController.getAnalyticsDashboard
);

module.exports = router;
