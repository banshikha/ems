// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/authMiddleware');
const { loginUser } = require('../controllers/authController'); // ✅ imported from controller

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
});

// ✅ REPLACED inline login with controller-based login
router.post('/login', loginUser);

// POST /api/auth/logout
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader && authHeader.split(' ')[1];

    if (!accessToken) {
      return res.status(400).json({ message: 'Access token is missing from header' });
    }

    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    await User.findByIdAndUpdate(decoded.userId, {
      $pull: { refreshTokens: { $in: [accessToken] } }
    });

    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      message: 'Server error during logout',
      error: error.message
    });
  }
});

// ✅ UPDATED: POST /api/auth/refresh-token
router.post('/refresh-token', async (req, res) => {
  const incomingToken = req.body.refreshToken || req.body.token;
  if (!incomingToken) {
    return res.status(401).json({ message: 'No refresh token provided' });
  }

  try {
    const payload = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(payload.userId);

    if (!user || !user.refreshTokens.includes(incomingToken)) {
      return res.status(403).json({ message: 'Refresh token revoked' });
    }

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      accessToken,
      user: {
        id: user._id,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Refresh-token error:', error.message);
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
});

// POST /api/auth/manager/login
router.post('/manager/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const manager = await User.findOne({ email, role: 'manager' });
    if (!manager) return res.status(404).json({ message: 'Manager not found' });

    const isMatch = await bcrypt.compare(password, manager.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { userId: manager._id, role: manager.role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    manager.refreshTokens.push(refreshToken);
    await manager.save();

    res.status(200).json({
      message: 'Manager login successful',
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error during manager login',
      error: error.message
    });
  }
});

// POST /api/auth/employee/login
router.post('/employee/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const employee = await User.findOne({ email, role: 'employee' });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { userId: employee._id, role: employee.role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    employee.refreshTokens.push(refreshToken);
    await employee.save();

    res.status(200).json({
      message: 'Employee login successful',
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error during employee login',
      error: error.message
    });
  }
});

module.exports = router;