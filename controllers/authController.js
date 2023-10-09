import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Response from '../utils/response.js';
import User from '../models/userModel.js';
import Cart from '../models/cartModel.js';

// Register new User
export const register = catchAsync(async (req, res, next) => {
  // Extract Data from requst
  const { fname, lname, email, phone, gender, dob, address, password } =
    req.body;

  // Check if user already exists
  if (await User.findOne({ email }))
    return next(
      new AppError(
        'Email is already exists! signin instead. http://localhost:5000/api/v1/auth/signin',
      ),
    );

  // Create new User
  let newUser = new User({
    fname,
    lname,
    email,
    phone,
    gender,
    dob,
    address,
    password,
  });

  if (!newUser) return next(new AppError('Something Went Wrong!', 500));

  // Assign new Cart to new User
  const newCart = assingCartToUser(newUser.id);

  // Save user after assignin cart
  newUser.cart = newCart.id;

  await newCart.save();
  await newUser.save();

  newUser = newUser.toObject();
  delete newUser.password;
  delete newUser.updatedAt;
  delete newUser.createdAt;

  Response(res, 'User Created Successfully.', 201, newUser);
});

// Sign in
export const signIn = catchAsync(async (req, res, next) => {
  // Get email & password from request
  const { email, password } = req.body;

  // check if user exists
  let user = await User.findOne({ email });

  // check if password & email match
  if (!user || !(await user.validatePassword(password)))
    return next(new AppError('Wrong Email or Password! Sign Up insted?!'), 404);

  // create new token
  const token = createToken(user.id, user.role);

  if (!token) return next(new AppError('Something Went Wrong!'), 500);

  // sign user in
  user.loggedIn = true;
  await user.save({ validateBeforeSave: false });

  user = user.toObject();
  delete user.password;
  delete user.updatedAt;
  delete user.createdAt;

  // Send Welcome Email

  // Send Response with created Token
  Response(res, 'User Logged in successfully.', 200, { user, token });
});

// Autenticate User
export const authenticate = catchAsync(async (req, res, next) => {
  // Get JWT token from header
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  )
    return next(
      new AppError('You are not logged, Please login and try again!', 401),
    );

  let token = req.headers.authorization.split(' ')[1];
  if (!token) return next(new AppError('Please login first!', 401));

  // Validate Token
  let decoded;
  try {
    const jwtVerifyPromise = promisify(jwt.verify);
    decoded = await jwtVerifyPromise(token, process.env.TOKEN_SECRET);
  } catch (error) {
    return next(
      new AppError('You are not logged, Please login and try again!', 401),
    );
  }

  // Check if user is stil exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError('You are not logged, Please login and try again!', 401),
    );

  // check if user has not changed his password after token was issued
  if (!currentUser.changedPasswordAfterTokenInitiated(decoded.iat))
    return next(
      new AppError(
        'You have changed your password, Please login and try again!',
        401,
      ),
    );

  // Authenticate this user
  req.user = currentUser;
  next();
});

// Authorize User
export const authorize = (...roles) => {
  return catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError('Access Denied! UnAuthorized.', 403));
    next();
  });
};

// Forget Password
// export const forgetPassword = catchAsync(async (req, res, next) => {
//   // Get User With Email
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) return next(new AppError('Email not found!', 400));

//   // Generate Reset Token
//   const resetToken = user.createResetPasswordToken();
//   await user.save({ validateBeforeSave: false });

//   // Email reset to user

//   // 3) Send it to user's email
//   const forgetPasswordUrl = `${req.protocol}://${req.get(
//     'host',
//   )}/api/v1/auth/resetPassword/${resetToken}`;

//   const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${forgetPasswordUrl}.\nIf you didn't forget your password, please ignore this email!`;

//   try {
//     const mailOptions = {
//       to: 'oa20180180',
//       subject: 'EC Reset Password',
//       message: message,
//       // html:
//     };

//     await Email(mailOptions);

//     Response(res, 'Reset Token sent to email!', 200);
//   } catch (err) {
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;
//     await user.save({ validateBeforeSave: false });

//     return next(
//       // new AppError('There was an error sending the email. Try again later!'),
//       err,
//       500,
//     );
//   }
// });

// Create Token
const createToken = (uId, userRole) => {
  // Create Token
  return jwt.sign({ id: uId, role: userRole }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRES_IN,
  });
};

// Assign Cart to user
const assingCartToUser = uId => {
  return Cart({ belongTo: uId });
};
