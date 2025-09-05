//userController.js
const User = require('../models/User');
const Task = require('../models/Task'); // ✅ Added for task assignment

/** Get list of all users */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -refreshTokens');
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

/** Get a single user by ID */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshTokens');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

/** Update a user by ID */
exports.updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.password;
    delete updates.refreshTokens;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -refreshTokens');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'User updated.', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

/** Delete a user by ID */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

/** Create a new employee (Admin only) */
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      status: 'active',
    });

    await newUser.save();

    res.status(201).json({ message: 'Employee created successfully.', userId: newUser._id });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

/** Delete an employee by ID (Admin only) */
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    res.status(200).json({
      message: 'Employee deleted successfully.',
      deletedUser: {
        _id: deletedUser._id,
        name: deletedUser.name,
        email: deletedUser.email,
        role: deletedUser.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

/** Get team members assigned to the logged-in manager */
exports.getManagerTeam = async (req, res) => {
  try {
    const managerId = req.user.userId;

    const team = await User.find({ manager: managerId, role: 'employee' }).select('-password -refreshTokens');

    res.status(200).json({ team });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch team', error: error.message });
  }
};

/** ✅ Assign a task to an employee or intern (Manager only) */
exports.assignTask = async (req, res) => {
  try {
    const { assigneeId, title, description, dueDate } = req.body;

    if (!assigneeId || !title || !dueDate) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const task = new Task({
      title,
      description,
      dueDate,
      assignedBy: req.user.userId,
      assignedTo: assigneeId
    });

    await task.save();
    res.status(201).json({ message: 'Task assigned successfully.', task });
  } catch (error) {
    console.error('Error assigning task:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

/** ✅ Get all tasks assigned by the logged-in manager */
exports.getManagerTasks = async (req, res) => {
  try {
    const managerId = req.user.userId;

    const tasks = await Task.find({ assignedBy: managerId })
      .populate('assignedTo', 'name role')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error('Error fetching manager tasks:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch tasks', error: error.message });
  }
};