// services/pdfService.js

const PDFDocument = require('pdfkit'); // A popular library for PDF generation
const fs = require('fs');

/**
 * Creates a payslip PDF and returns it as a buffer.
 * This is a mock function for demonstration purposes.
 * @param {object} payrollData - The payroll record from the database.
 * @returns {Promise<Buffer>} A promise that resolves with the PDF buffer.
 */
exports.createPayslip = async (payrollData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      doc.fontSize(25).text('Payslip', { align: 'center' });
      doc.moveDown();

      doc.fontSize(12).text(`Employee: ${payrollData.user.name}`);
      doc.text(`Month/Year: ${payrollData.month}/${payrollData.year}`);
      doc.moveDown();

      doc.text(`Gross Salary: $${payrollData.grossSalary.toFixed(2)}`);
      doc.text(`Deductions:`);
      doc.text(`  - Tax: $${payrollData.deductions.tax.toFixed(2)}`);
      doc.text(`  - Provident Fund: $${payrollData.deductions.providentFund.toFixed(2)}`);
      doc.moveDown();

      doc.fontSize(15).text(`Net Salary: $${payrollData.netSalary.toFixed(2)}`, { bold: true });

      doc.end();
      console.log('Payslip PDF buffer created.');
      
    } catch (err) {
      console.error('Failed to create payslip PDF:', err.message);
      reject(err);
    }
  });
};

/**
 * Creates an experience letter PDF and returns it as a buffer.
 * This is a mock function for demonstration purposes.
 * @param {object} offboardingRecord - The offboarding record.
 * @returns {Promise<Buffer>} A promise that resolves with the PDF buffer.
 */
exports.createExperienceLetter = async (offboardingRecord) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      doc.fontSize(20).text('Experience Letter', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`To Whom It May Concern,`);
      doc.moveDown();
      doc.text(`This letter is to confirm that ${offboardingRecord.user.name} was an employee at B2World from [Start Date] to ${offboardingRecord.lastWorkingDate.toDateString()}.`);
      doc.text(`They held the position of ${offboardingRecord.user.role}.`);
      doc.moveDown();
      doc.text(`We wish them all the best in their future endeavors.`);

      doc.end();
      console.log('Experience Letter PDF buffer created.');

    } catch (err) {
      console.error('Failed to create experience letter PDF:', err.message);
      reject(err);
    }
  });
};

/**
 * Creates a relieving letter PDF and returns it as a buffer.
 * This is a mock function for demonstration purposes.
 * @param {object} offboardingRecord - The offboarding record.
 * @returns {Promise<Buffer>} A promise that resolves with the PDF buffer.
 */
exports.createRelievingLetter = async (offboardingRecord) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      
      doc.fontSize(20).text('Relieving Letter', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Dear ${offboardingRecord.user.name},`);
      doc.moveDown();
      doc.text(`This is to inform you that your resignation has been accepted and you are hereby relieved from your duties at B2World effective ${offboardingRecord.lastWorkingDate.toDateString()}.`);
      doc.moveDown();
      doc.text('We wish you every success in your future career.');
      
      doc.end();
      console.log('Relieving Letter PDF buffer created.');

    } catch (err) {
      console.error('Failed to create relieving letter PDF:', err.message);
      reject(err);
    }
  });
};
