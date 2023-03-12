import express from "express";
import passport from "passport";
import session from "express-session";
import "./config/passport.config";
import allRouter from "./routes/index";
import { sequelize } from "./database/models";
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

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

try {
  app.use("/api/v1", allRouter);
} catch (error) {
  console.log(error);
}

export default app;
