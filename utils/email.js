import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use your email service provider
  auth: {
    user: 'mohamedel7dad2020@gmail.com', // Your email address
    pass: 'ijry klyi xeon uigz', // Your email password
  },
});

export default transporter