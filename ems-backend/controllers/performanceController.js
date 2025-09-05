// controllers/performanceController.js

const Performance = require('../models/Performance');

// Manager assigns task to intern/employee
exports.assignTask = async (req, res) => {
  try {
    const { employeeId, title, description, deadline } = req.body;

    const newTask = new Performance({
      employee: employeeId,
      manager: req.user.id,
      title,
      description,
      deadline,
      status: 'assigned'
    });

    await newTask.save();
    res.status(201).json({ message: 'Task assigned successfully', task: newTask });
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign task' });
  }
};

// Intern views assigned tasks
exports.getInternTasks = async (req, res) => {
  try {
    const internId = req.user.id;
    const tasks = await Performance.find({ employee: internId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch intern tasks' });
  }
};

// Intern submits progress report
exports.submitInternReport = async (req, res) => {
  try {
    const { taskId, progress, remarks } = req.body;

    const task = await Performance.findById(taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.progress = progress;
    task.remarks = remarks;
    task.status = 'submitted';

    await task.save();
    res.status(200).json({ message: 'Report submitted successfully', task });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit report' });
  }
};