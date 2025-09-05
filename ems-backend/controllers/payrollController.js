// 📄 File: controllers/payrollController.js

const Payroll = require('../models/Payroll');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const pdfService = require('../services/pdfService'); // Assuming you have a PDF service
const { getWorkingDaysInMonth, getPublicHolidays } = require('../utils/helpers'); // Assuming a helpers utility

/**
 * Automatically calculates and generates payroll for all employees.
 * This function could be triggered by a scheduled job (cron).
 * POST /api/payroll/calculate
 * (Admin only)
 */
exports.calculateMonthlyPayroll = async (req, res, next) => {
  try {
    const { month, year } = req.body;
    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required.' });
    }

    const employees = await User.find({ role: { $in: ['employee', 'manager'] } });
    const publicHolidays = await getPublicHolidays(month, year);

    let skippedCount = 0;
    let processedCount = 0;
    let totalNetAmount = 0;

    for (const employee of employees) {
      const existingPayroll = await Payroll.findOne({ user: employee._id, month, year });
      if (existingPayroll) {
        console.log(`Payroll for ${employee.email} for ${month}/${year} already exists. Skipping.`);
        skippedCount++;
        continue;
      }

      const totalDaysInMonth = new Date(year, month, 0).getDate();
      const workingDays = getWorkingDaysInMonth(year, month, publicHolidays);

      const attendanceRecords = await Attendance.find({
        user: employee._id,
        date: {
          $gte: new Date(year, month - 1, 1),
          $lt: new Date(year, month, 1)
        }
      });

      const daysPresent = attendanceRecords.filter(rec => rec.clockIn && rec.clockOut).length;
      const leaveDays = totalDaysInMonth - daysPresent;

      const baseSalary = 50000; // Ideally from user-specific config
      const dailyRate = baseSalary / workingDays;
      const grossSalary = dailyRate * daysPresent;

      const tax = grossSalary * 0.1;
      const providentFund = grossSalary * 0.12;
      const netSalary = grossSalary - tax - providentFund;

      await Payroll.create({
        user: employee._id,
        month,
        year,
        grossSalary,
        deductions: { tax, providentFund },
        netSalary
      });

      console.log(`Generated payroll for ${employee.email}`);
      processedCount++;
      totalNetAmount += netSalary;
    }

    res.status(200).json({
      message: 'Payroll calculated successfully',
      summary: {
        month,
        year,
        totalProcessed: processedCount,
        skipped: skippedCount,
        totalAmount: totalNetAmount
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Generates and downloads a payslip for a specific user and month.
 * GET /api/payroll/payslip/:userId/:month/:year
 */
exports.generatePayslip = async (req, res, next) => {
  try {
    const { userId, month, year } = req.params;

    const payroll = await Payroll.findOne({ user: userId, month, year }).populate('user', 'name email');
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found for the specified period.' });
    }

    const pdfBuffer = await pdfService.createPayslip(payroll);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=payslip-${payroll.user.name}-${month}-${year}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
};

/**
 * Gets a user's payroll history.
 * GET /api/payroll/history
 * (Employee/Intern only)
 */
exports.getPayrollHistory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const history = await Payroll.find({ user: userId }).sort({ year: -1, month: -1 });

    res.status(200).json({ message: 'Payroll history fetched successfully.', history });
  } catch (err) {
    next(err);
  }
};

/**
 * Gets a single payslip record for display (without generating a PDF).
 * GET /api/payroll/record/:id
 */
exports.getPayrollRecord = async (req, res, next) => {
  try {
    const payrollRecord = await Payroll.findById(req.params.id).populate('user', 'name email');
    if (!payrollRecord) {
      return res.status(404).json({ message: 'Payroll record not found.' });
    }

    if (req.user.role !== 'admin' && req.user.userId.toString() !== payrollRecord.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to view this record.' });
    }

    res.status(200).json({ message: 'Payroll record fetched successfully.', record: payrollRecord });
  } catch (err) {
    next(err);
  }
};