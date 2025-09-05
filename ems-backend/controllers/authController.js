// controllers/authController.js

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Register a new user (employee)
 * Used in POST /api/employees
 */
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Basic validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    // Create and save new user
    const newUser = new User({ name, email, password, role });
    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Register error:', err.message);
    return res.status(500).json({ message: 'Server error.' });
  }
};

/**
 * Refresh access token
 */
exports.refreshToken = async (req, res, next) => {
  const incomingToken = req.body.refreshToken || req.body.token;
  if (!incomingToken) {
    return res.status(401).json({ message: 'No refresh token provided.' });
  }

  try {
    const payload = jwt.verify(
      incomingToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(payload.userId);
    if (!user || !user.refreshTokens.includes(incomingToken)) {
      return res.status(403).json({ message: 'Refresh token revoked or invalid.' });
    }

    const newAccessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({
      accessToken: newAccessToken,
      user: {
        id: user._id,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Refresh token error:', err.message);
    return res.status(403).json({ message: 'Invalid or expired refresh token.' });
  }
};

/**
 * Logout using access token
 */
exports.logout = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: 'Access token is required' });
    }

    // Optionally verify the token
    // const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    // Since access tokens are stateless, just respond with success
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err.message);
    return res.status(500).json({ message: 'Server error during logout', error: err.message });
  }
};

/**
 * Login user and return tokens + user info
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // Optionally store refresh token
    user.refreshTokens = user.refreshTokens || [];
    user.refreshTokens.push(refreshToken);
    await user.save();

    // Send response
    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ message: 'Server error during login.' });
  }
};