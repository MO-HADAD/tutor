// Admin Controller
// Third Parties Imports
import argon from 'argon2';
import catchAsync from '../utils/catchAsync.js';

// Local Imports
import { createAdminValidation } from '../validations/adminValidation.js';
import AppError from '../utils/appError.js';
import Response from '../utils/response.js';
import prisma from '../utils/prismaClient.js';

/**
 * @desc    Create An Admin
 * @route   POST /api/admin
 * @access  Developers Only
 */

export const createAdmin = catchAsync(async (req, res, next) => {
  // Extract user input from req body
  const { firstName, lastName, email, password } = req.body;

  // Validate user input
  const { error, value } = createAdminValidation.validate({
    firstName,
    lastName,
    email,
    password,
  });
  if (error) return next(new AppError(error, 400));

  //   Hash password
  const hashedPassword = await argon.hash(password);

  // create new Admin
  const newAdmin = await prisma.admin.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    },
  });

  Response(res, 'Admin Created.', 201, newAdmin);
});
