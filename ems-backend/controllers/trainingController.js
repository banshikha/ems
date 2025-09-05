// controllers/trainingController.js

const Training = require('../models/Training');
const User = require('../models/User');

/**
 * Create a new training course
 * POST /api/training/create
 * (Admin/Manager only)
 */
exports.createTraining = async (req, res, next) => {
  try {
    const { title, description, targetAudience, startDate, endDate, resources } = req.body;
    const trainerId = req.user.userId;

    const newTraining = new Training({
      title,
      description,
      trainer: trainerId,
      targetAudience,
      startDate,
      endDate,
      resources
    });

    await newTraining.save();
    res.status(201).json({
      message: 'Training course created successfully.',
      training: newTraining
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all training courses for the logged-in user's role
 * GET /api/training/my-courses
 * (All roles)
 */
exports.getTrainingCourses = async (req, res, next) => {
  try {
    const userRole = req.user.role;
    const trainings = await Training.find({
      targetAudience: { $in: [userRole] }
    }).populate('trainer', 'name');

    res.status(200).json({
      message: 'Training courses fetched successfully.',
      trainings
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Mark a training course as completed for the logged-in user
 * POST /api/training/complete/:id
 * (Employee/Intern only)
 */
exports.completeTraining = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const training = await Training.findById(id);
    if (!training) {
      return res.status(404).json({ message: 'Training course not found.' });
    }

    // Check if user has already completed this training
    const hasCompleted = training.completedBy.some(record => record.user.toString() === userId);
    if (hasCompleted) {
      return res.status(400).json({ message: 'You have already completed this training.' });
    }

    // Add user to the completedBy list
    training.completedBy.push({ user: userId });
    await training.save();

    res.status(200).json({ message: 'Training marked as completed successfully.', training });
  } catch (err) {
    next(err);
  }
};
