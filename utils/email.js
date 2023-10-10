const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use your email service provider
  auth: {
    user: 'your-email@gmail.com', // Your email address
    pass: 'your-password', // Your email password
  },
});

module.exports = transporter;