import express from 'express';
import welcomeRoute from './routes/welcomeRoute.js';
import middleware from './middlewares/middleware.js';
import welcomeController from './controllers/welcomeController.js';

const app = express();

// Set up middleware
app.use(middleware);

// Set up routes
app.use('/', welcomeRoute);
app.get('/welcome', welcomeController);

export default app;
