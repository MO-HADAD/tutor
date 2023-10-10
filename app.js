// Modules Imports
import express from 'express';
import morgan from 'morgan';

// SEC Local Impports
// Router Imports
import adminRouter from './routers/adminRouter.js';
import clientRouter from './routers/clientRouter.js';
import authRouter from './routers/authRouter.js';

// Controllers Imports
import globalErrorHandler from './controllers/errorController.js';

// Utils Imports
import AppError from './utils/appError.js';

const app = express();

// Body Parser
app.use(express.json());

// Logging Request
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routers
app.use('/api/admin', adminRouter);
app.use('/api/client', clientRouter);
app.use('/auth', authRouter);

// Not Found Router
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
// app.use(globalErrorHandler);

export default app;
