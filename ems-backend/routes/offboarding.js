// routes/offboarding.js

const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const offboardingController = require('../controllers/offboardingController');

/**
 * @route POST /api/offboarding/resign
 * @desc Initiates the offboarding process for an employee/intern
 * @access Employee/Intern
 */
router.post(
  '/resign',
  authenticateToken,
  authorizeRoles('employee', 'intern'),
  offboardingController.initiateResignation
);

/**
 * @route PUT /api/offboarding/update-clearance/:userId
 * @desc Admin/Manager updates the clearance status of a user
 * @access Admin/Manager
 */
router.put(
  '/update-clearance/:userId',
  authenticateToken,
  authorizeRoles('admin', 'manager'),
  offboardingController.updateClearanceStatus
);

/**
 * @route GET /api/offboarding/experience-letter/:userId
 * @desc Admin generates and downloads an experience letter
 * @access Admin
 */
router.get(
  '/experience-letter/:userId',
  authenticateToken,
  authorizeRoles('admin'),
  offboardingController.generateExperienceLetter
);

/**
 * @route GET /api/offboarding/relieving-letter/:userId
 * @desc Admin generates and downloads a relieving letter
 * @access Admin
 */
router.get(
  '/relieving-letter/:userId',
  authenticateToken,
  authorizeRoles('admin'),
  offboardingController.generateRelievingLetter
);

/**
 * @route GET /api/offboarding/status/:userId
 * @desc Get the offboarding status for a specific user
 * @access Employee/Admin
 */
router.get(
  '/status/:userId',
  authenticateToken,
  offboardingController.getOffboardingStatus
);

module.exports = router;
