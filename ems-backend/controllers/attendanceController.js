// controllers/attendanceController.js

const Attendance = require('../models/Attendance');

// 1. Clock In
exports.clockIn = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const now    = new Date();

    // Calculate start/end of today without mutating `now`
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // Look for today’s record
    let record = await Attendance.findOne({
      user: userId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (record && record.clockIn) {
      return res.status(400).json({ message: 'Already clocked in today' });
    }

    if (!record) {
      record = await Attendance.create({
        user:    userId,
        date:    now,
        clockIn: now
      });
    } else {
      record.clockIn = now;
      await record.save();
    }

    res.status(200).json({ success: true, record });
  } catch (err) {
    next(err);
  }
};

// 2. Clock Out
exports.clockOut = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const now    = new Date();

    // Same today’s window
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const record = await Attendance.findOne({
      user:     userId,
      date:     { $gte: startOfDay, $lte: endOfDay },
      clockIn:  { $exists: true },
      clockOut: { $exists: false }
    });

    if (!record) {
      return res.status(400).json({ message: 'No active clock-in found for today' });
    }

    record.clockOut = now;
    await record.save();

    res.status(200).json({ success: true, record });
  } catch (err) {
    next(err);
  }
};

// 3. View Calendar (monthly)
exports.getCalendar = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const now    = new Date();
    const m      = req.query.month ? parseInt(req.query.month, 10) - 1 : now.getMonth();
    const y      = req.query.year  ? parseInt(req.query.year, 10)       : now.getFullYear();

    const startDate = new Date(y, m,     1);
    const endDate   = new Date(y, m + 1, 1);

    const records = await Attendance.find({
      user: userId,
      date: { $gte: startDate, $lt: endDate }
    }).sort({ date: 1 });

    res.status(200).json({ success: true, records });
  } catch (err) {
    next(err);
  }
};