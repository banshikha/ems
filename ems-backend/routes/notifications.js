// routes/notifications.js

const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const notificationController = require('../controllers/notificationController');

/**
 * @route GET /api/notifications/unread
 * @desc Get all unread notifications for the logged-in user
 * @access Private
 */
router.get(
  '/unread',
  authenticateToken,
  notificationController.getUnreadNotifications
);

/**
 * @route GET /api/notifications
 * @desc Get all notifications for the logged-in user
 * @access Private
 */
router.get(
  '/',
  authenticateToken,
  notificationController.getAllNotifications
);

/**
 * @route PUT /api/notifications/mark-as-read
 * @desc Mark one or more notifications as read
 * @access Private
 */
router.put(
  '/mark-as-read',
  authenticateToken,
  notificationController.markAsRead
);

module.exports = router;
