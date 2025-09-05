// controllers/notificationController.js

const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * Creates a new notification. This is a helper function that
 * can be called from other controllers (e.g., when a leave is approved).
 * It's not exposed as an API endpoint itself.
 *
 * @param {string} recipientId - The ID of the user to receive the notification.
 * @param {string} title - The notification title.
 * @param {string} body - The notification body/message.
 * @param {string} relatedTo - The module this notification relates to (e.g., 'leave', 'task').
 * @param {string} relatedId - The ID of the related document (e.g., leave request ID).
 */
exports.createNotification = async ({ recipientId, title, body, relatedTo, relatedId }) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      title,
      body,
      relatedTo,
      relatedId
    });
    await notification.save();
    console.log(`Notification created for user ${recipientId}`);
  } catch (err) {
    console.error('Failed to create notification:', err.message);
  }
};

/**
 * Gets all unread notifications for the logged-in user.
 * GET /api/notifications/unread
 */
exports.getUnreadNotifications = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const notifications = await Notification.find({
      recipient: userId,
      read: false
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Unread notifications fetched successfully.',
      notifications
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Gets all notifications for the logged-in user.
 * GET /api/notifications
 */
exports.getAllNotifications = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const notifications = await Notification.find({
      recipient: userId
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: 'All notifications fetched successfully.',
      notifications
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Marks one or more notifications as read.
 * PUT /api/notifications/mark-as-read
 */
exports.markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { notificationIds } = req.body;

    if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res.status(400).json({ message: 'A list of notification IDs is required.' });
    }

    await Notification.updateMany(
      { _id: { $in: notificationIds }, recipient: userId },
      { $set: { read: true } }
    );

    res.status(200).json({ message: 'Notifications marked as read successfully.' });
  } catch (err) {
    next(err);
  }
};
