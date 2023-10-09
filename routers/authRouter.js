// Imports
import express from 'express';
import {
  // forgetPassword,
  register,
  signIn,
} from '../controllers/authController.js';

// Router App
const router = express.Router();

// SEC Auth Endpoints

// Register endpoint
router.post('/register', register);

// Sigin endpoint
router.post('/signin', signIn);

// Forget Password
// router.get('/forget-password', forgetPassword);

// // Reset Password
// router.get('/resetPassword/:reset-token');
// Router Expors
export default router;
