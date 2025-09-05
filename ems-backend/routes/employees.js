const express               = require('express');
const router                = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const roleCheck             = require('../middleware/roleCheck');
const authController        = require('../controllers/authController');
const userController        = require('../controllers/userController');

/**
 * Admin-only employee management routes
 * Mounted at /api/employees in server.js
 */

// Create a new employee
// POST /api/employees
router.post(
  '/',
  authenticateToken,
  roleCheck('admin'),
  authController.registerUser
);

// Get all employees
// GET /api/employees
router.get(
  '/',
  authenticateToken,
  roleCheck('admin'),
  userController.getUsers
);

// Update an existing employee
// PUT /api/employees/:id
router.put(
  '/:id',
  authenticateToken,
  roleCheck('admin'),
  userController.updateUser
);

// Delete an employee
// DELETE /api/employees/:id
router.delete(
  '/:id',
  authenticateToken,
  roleCheck('admin'),
  userController.deleteUser
);

// Alias route for admin panel
// GET /api/employees/admin/employees
router.get(
  '/admin/employees',
  authenticateToken,
  roleCheck('admin'),
  userController.getUsers
);

module.exports = router;