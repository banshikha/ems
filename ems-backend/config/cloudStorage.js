// config/cloudStorage.js
// This file sets up the configuration for file uploads, e.g., to Cloudinary or AWS S3.

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuration for Cloudinary. Replace with your actual credentials from the .env file.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ems-documents', // A folder to store all EMS related files
    allowedFormats: ['jpeg', 'png', 'pdf', 'docx']
  }
});

module.exports = {
  cloudinary,
  storage
};
