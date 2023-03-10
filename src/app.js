import express from 'express';
import welcomeRoute from './routes/welcomeRoute.js';
import middleware from './middlewares/middleware.js';
import authRoute from './routes/authRoute.js'
import welcomeController from './controllers/welcomeController.js';
import './googleAuth.js'
import session from 'express-session';
import passport from 'passport';
import {sequelize} from './database/models'
const app = express();
app.use(session({secret:'cats'}));
app.use(passport.initialize())
app.use(passport.session());

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
app.use('/middle', welcomeRoute);
app.use('/',authRoute)

app.get('/welcome', welcomeController);

export default app;
