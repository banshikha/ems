// 📄 File: middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

/**
 * authenticateToken
 *  - Looks for token in:
 *      • Authorization: Bearer <JWT>
 *      • accesstoken: <JWT> (or “Bearer <JWT>”)
 *  - Attaches decoded payload to req.user
 */
function authenticateToken(req, res, next) {
  console.log('>>> authorization header:', req.headers['authorization']);
  console.log('>>> accessToken header:', req.headers['accesstoken']);

  let token;

  // 1) Standard Authorization header
  const authHeader = req.header('authorization');
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    token = authHeader.slice(7).trim();
    console.log('→ Using token from Authorization header');
  }

  // 2) Fallback to custom accesstoken header
  if (!token) {
    const raw = req.header('accesstoken');
    if (raw) {
      token = raw.toLowerCase().startsWith('bearer ')
        ? raw.slice(7).trim()
        : raw.trim();
      console.log('→ Using token from accesstoken header');
    }
  }

  // 3) No token found
  if (!token) {
    console.warn('Missing JWT. Authorization:', authHeader, 'accessToken:', req.header('accesstoken'));
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided or malformed header.' });
  }

  // 4) Verify and attach user context
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };
    console.log('Token verified. Decoded payload:', req.user);
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res
      .status(401)
      .json({ message: 'Invalid or expired token. ' + err.message });
  }
}

/**
 * authorizeRoles(...)
 *  - Guards routes to only allow certain roles
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      console.warn('Authorization attempted without user on request.');
      return res.status(401).json({ message: 'Unauthorized. No user context.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      console.warn(`User role "${req.user.role}" not allowed.`, 'Allowed:', allowedRoles);
      return res
        .status(403)
        .json({ message: 'Forbidden. Insufficient permissions.' });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRoles
};