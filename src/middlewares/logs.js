import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD' }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs.log' })
  ]
});

const logMiddleware = (req, res, next) => {
  logger.info({
    type: 'access',
    method: req.method,
    url: req.url
  });

  next();
};

const logError = (err, req, res, next) => {
  logger.error({
    type: 'error',
    message: err.message,
    stack: err.stack,
  });
  res.status(500).json({ error: 'Internal server error' });
  next();
};
export { logMiddleware, logger, logError };
