// utils/logger.js
// This is a simple logging utility. For production, you might use a more robust
// library like Winston or Pino.

const chalk = require('chalk'); // A library for styling console output

const log = console.log;

const logger = {
  info: (message) => {
    log(chalk.blue.bold(`[INFO] ${new Date().toISOString()}: ${message}`));
  },
  warn: (message) => {
    log(chalk.yellow.bold(`[WARN] ${new Date().toISOString()}: ${message}`));
  },
  error: (message) => {
    log(chalk.red.bold(`[ERROR] ${new Date().toISOString()}: ${message}`));
  },
  success: (message) => {
    log(chalk.green.bold(`[SUCCESS] ${new Date().toISOString()}: ${message}`));
  },
  debug: (message) => {
    if (process.env.NODE_ENV === 'development') {
      log(chalk.gray.bold(`[DEBUG] ${new Date().toISOString()}: ${message}`));
    }
  }
};

module.exports = logger;
