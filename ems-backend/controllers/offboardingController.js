// controllers/offboardingController.js

const Offboarding = require('../models/Offboarding');
const User = require('../models/User');
const pdfService = require('../services/pdfService'); // Assuming a service for PDF generation
const { createNotification } = require('./notificationController'); // Helper function for notifications

/**
 * Initiates the offboarding process (Employee resignation)
 * POST /api/offboarding/resign
 */
exports.initiateResignation = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { resignationDate, lastWorkingDate, reasonForLeaving } = req.body;

    // Check if an offboarding process is already in progress for this user
    const existingRecord = await Offboarding.findOne({ user: userId });
    if (existingRecord) {
      return res.status(400).json({ message: 'Offboarding process already initiated for this user.' });
    }

    const newRecord = new Offboarding({
      user: userId,
      resignationDate,
      lastWorkingDate,
      reasonForLeaving
    });

    await newRecord.save();

    // Notify the user's manager and HR admin
    const user = await User.findById(userId);
    if (user && user.manager) {
      await createNotification({
        recipientId: user.manager,
        title: 'Resignation Submitted',
        body: `${user.name} has submitted their resignation.`,
        relatedTo: 'offboarding',
        relatedId: newRecord._id
      });
    }

    // A simple notification for the HR/Admin role, which you'd find via a query
    // In a real app, you'd find the admin users and notify them all.
    const adminUser = await User.findOne({ role: 'admin' });
    if (adminUser) {
       await createNotification({
        recipientId: adminUser._id,
        title: 'Resignation Submitted',
        body: `${user.name} has submitted their resignation.`,
        relatedTo: 'offboarding',
        relatedId: newRecord._id
      });
    }


    res.status(201).json({
      message: 'Resignation submitted successfully. The offboarding process has begun.',
      record: newRecord
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin/Manager updates the clearance status for a user
 * PUT /api/offboarding/update-clearance/:userId
 */
exports.updateClearanceStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { hr, it, finance, manager } = req.body;

    const record = await Offboarding.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          'clearanceStatus.hr': hr,
          'clearanceStatus.it': it,
          'clearanceStatus.finance': finance,
          'clearanceStatus.manager': manager
        }
      },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ message: 'Offboarding record not found.' });
    }

    res.status(200).json({
      message: 'Clearance status updated successfully.',
      record
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin generates and downloads an experience letter
 * GET /api/offboarding/experience-letter/:userId
 */
exports.generateExperienceLetter = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const record = await Offboarding.findOne({ user: userId }).populate('user');

    if (!record) {
      return res.status(404).json({ message: 'Offboarding record not found.' });
    }

    // This part assumes a service that creates a PDF and returns a buffer
    const pdfBuffer = await pdfService.createExperienceLetter(record);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=experience-letter-${record.user.name}.pdf`);
    res.send(pdfBuffer);

    // Optionally update the status in the database
    record.experienceLetterGenerated = true;
    await record.save();

  } catch (err) {
    next(err);
  }
};

/**
 * Admin generates and downloads a relieving letter
 * GET /api/offboarding/relieving-letter/:userId
 */
exports.generateRelievingLetter = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const record = await Offboarding.findOne({ user: userId }).populate('user');

    if (!record) {
      return res.status(404).json({ message: 'Offboarding record not found.' });
    }

    // This part assumes a service that creates a PDF and returns a buffer
    const pdfBuffer = await pdfService.createRelievingLetter(record);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=relieving-letter-${record.user.name}.pdf`);
    res.send(pdfBuffer);

    // Optionally update the status in the database
    record.relievingLetterGenerated = true;
    await record.save();

  } catch (err) {
    next(err);
  }
};

/**
 * Get the offboarding status for a specific user
 * GET /api/offboarding/status/:userId
 */
exports.getOffboardingStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Authorization check: Only the user themselves or an admin can view this
    if (req.user.userId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to view this record.' });
    }

    const record = await Offboarding.findOne({ user: userId }).populate('user', 'name email role');
    if (!record) {
      return res.status(404).json({ message: 'No offboarding record found for this user.' });
    }

    res.status(200).json({ message: 'Offboarding status fetched successfully.', record });
  } catch (err) {
    next(err);
  }
};
