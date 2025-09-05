//routes/users.js

const express                   = require('express');
const router                    = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const User                      = require('../models/User');
const { deleteEmployee }        = require('../controllers/userController'); // ✅ NEW IMPORT

// GET  /api/admin/employees
// List all users (passwords excluded)
router.get(
  '/employees',
  authenticateToken,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const employees = await User.find().select('-password');
      res.json(employees);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// POST /api/admin/create-employee
// Create a new user
router.post(
  '/create-employee',
  authenticateToken,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      if (await User.findOne({ email })) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      const newUser = new User({ name, email, password, role });
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// PUT  /api/admin/update-role/:id
router.put(
  '/update-role/:id',
  authenticateToken,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const { role } = req.body;
      const allowedRoles = ['admin', 'manager', 'employee', 'intern'];

      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role provided' });
      }

      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.role = role;
      await user.save();

      res.json({
        message: 'Role updated successfully',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ✅ NEW DELETE ROUTE using controller logic
// DELETE /api/admin/delete-employee/:id
router.delete(
  '/delete-employee/:id',
  authenticateToken,
  authorizeRoles('admin'),
  deleteEmployee
);

module.exports = router;