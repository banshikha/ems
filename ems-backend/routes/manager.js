// ─────────────────────────────────────────────
// File: routes/manager.js
// Description: Manager Panel routes (team view, task assignment)
// ─────────────────────────────────────────────

const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const { getManagerTeam, assignTask, getManagerTasks } = require('../controllers/userController'); // ✅ Added getManagerTasks

// View team members
router.get('/team', authenticateToken, authorizeRoles('manager'), getManagerTeam);

// Assign task to employee/intern
router.post('/assign-task', authenticateToken, authorizeRoles('manager'), assignTask);

// View all tasks assigned by manager
router.get('/tasks', authenticateToken, authorizeRoles('manager'), getManagerTasks); // ✅ New route

module.exports = router;

