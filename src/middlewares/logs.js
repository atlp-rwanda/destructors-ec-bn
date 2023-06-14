import winston from 'winston';
import { Log } from '../database/models';

export const logAccess = async (req, res, next) => {
  try {
    const logData = {
      type: 'access',
      message: 'Access Request',
      method: req.method,
      url: req.originalUrl,
      timestamp: new Date().toISOString().split('T')[0]
    };
    await Log.create(logData);

    next();
  } catch (error) {
    next(error);
  }
};

export const logError = async (err, req, res, next) => {
  try {
    const logData = {
      type: 'error',
      message: 'Error occurred',
      method: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString().split('T')[0]
    };
    await Log.create(logData);
    next(err);
  } catch (error) {
    next(error);
  }
};
