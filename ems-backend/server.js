const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// 🌱 Load environment variables
dotenv.config();

// 🔌 Connect to MongoDB
connectDB();

// 🚀 Initialize Express App
const app = express();
app.use(cors());
app.use(express.json());

// 📦 Route Imports
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const employeesRoutes = require('./routes/employees');
const managerRoutes = require('./routes/manager');
const attendanceRoutes = require('./routes/attendance');
const performanceRoutes = require('./routes/performance');
const leaveRoutes = require('./routes/leave');
const payrollRoutes = require('./routes/payroll');
const trainingRoutes = require('./routes/training');
const notificationsRoutes = require('./routes/notifications');
const offboardingRoutes = require('./routes/offboarding');
const chatbotRoutes = require('./routes/chatbot');
const analyticsRoutes = require('./routes/analytics');
const usersRoutes = require('./routes/users'); // Optional if used separately
const adminRoutes = require('./routes/users'); // ✅ NEW: for /api/admin endpoints

// 🧭 API Route Bindings
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/offboarding', offboardingRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', usersRoutes); // Optional
app.use('/api/admin', adminRoutes); // ✅ NEW

// 🩺 Health Check
app.get('/', (req, res) => {
  res.send('EMS Backend is running');
});

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));