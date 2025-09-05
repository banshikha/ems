// middleware/roleCheck.js

/**
 * Role-based access control middleware
 * @param {...string} allowedRoles - e.g. 'admin', 'manager'
 */
function roleCheck(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user && req.user.role;

    // 1) Not authenticated
    if (!userRole) {
      return res
        .status(401)
        .json({ message: 'Unauthorized. No user context.' });
    }

    // 2) Role not allowed
    if (!allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: 'Forbidden. Access denied.' });
    }

    // 3) Allowed—proceed
    next();
  };
}

// ✅ Named export for compatibility with destructured imports
module.exports = roleCheck;
module.exports.authorizeRoles = roleCheck;