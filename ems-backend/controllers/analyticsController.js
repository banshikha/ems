// controllers/analyticsController.js

const User = require('../models/User');
const Attendance = require('../models/Attendance');
const LeaveRequest = require('../models/LeaveRequest');

/**
 * Generates and saves monthly analytics data for admins.
 * This is a scheduled task, not a direct API endpoint.
 * It combines data from different modules into a single record.
 */
exports.generateMonthlyAnalytics = async () => {
  try {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // getMonth() is 0-indexed
    const currentYear = today.getFullYear();
    const periodId = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

    console.log(`Generating analytics for ${periodId}...`);

    // Fetch data for employee performance (e.g., total tasks completed)
    const employeePerformance = await getEmployeePerformanceData();
    // Fetch data for leave trends (e.g., leave types, approval rates)
    const leaveTrends = await getLeaveTrendsData(currentMonth, currentYear);
    // Fetch data for attendance insights (e.g., total days clocked in, remote vs office)
    const attendanceInsights = await getAttendanceInsights(currentMonth, currentYear);

    // This data would be saved to a new Analytics model instance
    // For now, we will log it.
    console.log('Employee Performance:', employeePerformance);
    console.log('Leave Trends:', leaveTrends);
    console.log('Attendance Insights:', attendanceInsights);

    console.log('Analytics generation complete.');
  } catch (err) {
    console.error('Error generating monthly analytics:', err.message);
  }
};

/**
 * Gets attendance insights for a given month and year.
 * @param {number} month - The month (1-12).
 * @param {number} year - The year.
 * @returns {object} - Insights data.
 */
async function getAttendanceInsights(month, year) {
  // Get all attendance records for the month
  const attendanceRecords = await Attendance.find({
    date: {
      $gte: new Date(year, month - 1, 1),
      $lt: new Date(year, month, 1)
    }
  });

  // Calculate total days present and hours worked
  let totalClockIns = attendanceRecords.filter(rec => rec.clockIn).length;
  let totalHours = 0;
  attendanceRecords.forEach(rec => {
    if (rec.clockIn && rec.clockOut) {
      totalHours += (rec.clockOut - rec.clockIn) / (1000 * 60 * 60); // Convert milliseconds to hours
    }
  });

  return { totalClockIns, totalHours: parseFloat(totalHours.toFixed(2)) };
}

/**
 * Gets leave trends for a given month and year.
 * @param {number} month - The month (1-12).
 * @param {number} year - The year.
 * @returns {object} - Leave trends data.
 */
async function getLeaveTrendsData(month, year) {
  const leaveRecords = await LeaveRequest.find({
    from: {
      $gte: new Date(year, month - 1, 1),
      $lt: new Date(year, month, 1)
    }
  });

  const totalRequests = leaveRecords.length;
  const approvedRequests = leaveRecords.filter(l => l.status === 'approved').length;
  const rejectedRequests = leaveRecords.filter(l => l.status === 'rejected').length;

  return { totalRequests, approvedRequests, rejectedRequests };
}

/**
 * Gets employee performance data.
 * @returns {object} - Performance data.
 */
async function getEmployeePerformanceData() {
  // This is a placeholder. A real implementation would query the Performance model
  // to aggregate task completion, feedback scores, etc.
  return {
    completedTasks: 120, // Example value
    averageCompletionTime: '2.5 days', // Example value
    topPerformers: ['Alice Admin', 'Bob Manager']
  };
}

/**
 * API endpoint to get the latest analytics data.
 * GET /api/analytics/dashboard
 * (Admin only)
 */
exports.getAnalyticsDashboard = async (req, res, next) => {
  try {
    // This would fetch the most recent analytics record from the database.
    // For now, we will return mock data.
    const latestAnalytics = {
      employeePerformance: {
        completedTasks: 120,
        averageCompletionTime: '2.5 days',
        topPerformers: ['Alice Admin', 'Bob Manager']
      },
      leaveTrends: {
        totalRequests: 50,
        approvedRequests: 45,
        rejectedRequests: 5
      },
      attendanceInsights: {
        totalClockIns: 1500,
        totalHours: 12000
      }
    };

    res.status(200).json({
      message: 'Analytics data fetched successfully.',
      data: latestAnalytics
    });

  } catch (err) {
    next(err);
  }
};
