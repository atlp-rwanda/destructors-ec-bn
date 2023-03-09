import express from 'express';
import welcomeRoute from './routes/welcomeRoute.js';
import middleware from './middlewares/middleware.js';
import welcomeController from './controllers/welcomeController.js';
import {sequelize} from './database/models'
const app = express();


export const connectDB = async () => {
    try {
      await sequelize.authenticate();
      console.log("Database connection established successfully");
    } catch (err) {
      console.log(`Database connection failed: ${err}`);
      process.exit(1);
    }
  };
  
  
  
  
  
  
  
// Set up middleware
app.use(middleware);

// Set up routes
app.use('/', welcomeRoute);

app.get('/welcome', welcomeController);

export default app;
