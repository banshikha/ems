// routes/training.js

const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const trainingController = require('../controllers/trainingController');

/**
 * @route POST /api/training/create
 * @desc Create a new training course
 * @access Admin/Manager
 */
router.post(
  '/create',
  authenticateToken,
  authorizeRoles('admin', 'manager'),
  trainingController.createTraining
);

/**
 * @route GET /api/training/my-courses
 * @desc Get all training courses relevant to the user's role
 * @access All Authenticated Users
 */
router.get(
  '/my-courses',
  authenticateToken,
  trainingController.getTrainingCourses
);

/**
 * @route POST /api/training/complete/:id
 * @desc Mark a training course as completed
 * @access Employee/Intern
 */
router.post(
  '/complete/:id',
  authenticateToken,
  authorizeRoles('employee', 'intern'),
  trainingController.completeTraining
);

module.exports = router;
