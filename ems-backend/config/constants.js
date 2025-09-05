// config/constants.js

const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
  INTERN: 'intern'
};

const LEAVE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

const OFFBOARDING_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed'
};

const NOTIFICATION_TYPES = {
  EMAIL: 'email',
  SMS: 'sms',
  IN_APP: 'in-app',
  WHATSAPP: 'whatsapp'
};

const NOTIFICATION_RELATED_TO = {
  LEAVE: 'leave',
  TASK: 'task',
  PAYROLL: 'payroll',
  TRAINING: 'training',
  ANNOUNCEMENT: 'announcement',
  OTHER: 'other'
};

module.exports = {
  USER_ROLES,
  LEAVE_STATUS,
  OFFBOARDING_STATUS,
  TASK_STATUS,
  NOTIFICATION_TYPES,
  NOTIFICATION_RELATED_TO
};
