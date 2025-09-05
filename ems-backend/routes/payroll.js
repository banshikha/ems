// routes/payroll.js

const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const payrollController = require('../controllers/payrollController');

/**
 * @route POST /api/payroll/calculate
 * @desc Admin calculates monthly payroll for all employees
 * @access Admin
 */
router.post(
  '/calculate',
  authenticateToken,
  authorizeRoles('admin'),
  payrollController.calculateMonthlyPayroll
);

/**
 * @route GET /api/payroll/payslip/:userId/:month/:year
 * @desc Get and download a user's payslip as a PDF
 * @access Employee/Admin
 */
router.get(
  '/payslip/:userId/:month/:year',
  authenticateToken,
  authorizeRoles('employee', 'intern', 'admin', 'manager'),
  payrollController.generatePayslip
);

/**
 * @route GET /api/payroll/history
 * @desc Get a user's payroll history
 * @access Employee/Intern
 */
router.get(
  '/history',
  authenticateToken,
  authorizeRoles('employee', 'intern'),
  payrollController.getPayrollHistory
);

/**
 * @route GET /api/payroll/record/:id
 * @desc Get a single payslip record for display
 * @access Employee/Admin
 */
router.get(
  '/record/:id',
  authenticateToken,
  authorizeRoles('employee', 'intern', 'admin', 'manager'),
  payrollController.getPayrollRecord
);

module.exports = router;
