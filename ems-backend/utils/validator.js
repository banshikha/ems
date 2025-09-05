// utils/validator.js
// This file contains a simple utility for validating common input patterns.
// For production, you might use a dedicated library like Joi or express-validator.

/**
 * Checks if a string is a valid email address.
 * @param {string} email - The email to validate.
 * @returns {boolean} - True if valid, false otherwise.
 */
exports.isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  // A simple regex for email validation
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Checks if a password meets a minimum length requirement.
 * @param {string} password - The password to validate.
 * @param {number} minLength - The minimum required length.
 * @returns {boolean} - True if valid, false otherwise.
 */
exports.isValidPassword = (password, minLength = 6) => {
  if (!password || typeof password !== 'string') return false;
  return password.length >= minLength;
};

/**
 * Checks if an ID is a valid MongoDB ObjectId.
 * @param {string} id - The ID to validate.
 * @returns {boolean} - True if valid, false otherwise.
 */
exports.isValidObjectId = (id) => {
  if (!id || typeof id !== 'string') return false;
  // A simple check for a 24-character hex string
  const re = /^[0-9a-fA-F]{24}$/;
  return re.test(id);
};

/**
 * Sanitizes and trims a string to prevent common security issues.
 * @param {string} input - The string to sanitize.
 * @returns {string} - The sanitized string.
 */
exports.sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  return input.trim().replace(/<[^>]*>?/gm, ''); // Removes HTML tags
};
