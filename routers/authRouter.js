// Imports
import express from 'express';
import {
  // forgetPassword,
  register,
  signIn,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';

// Router App
const router = express.Router();

// SEC Auth Endpoints

// Register endpoint
router.post('/register', register);

// Sigin endpoint
router.post('/signin', signIn);

// Forget Password
router.post('/forgot-password', forgotPassword);


// // Reset Password
router.post('/reset-password', resetPassword);
// Router Expors
export default router;
