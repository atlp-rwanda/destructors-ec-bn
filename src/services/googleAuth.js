import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import passport from 'passport';
import { config } from 'dotenv';
import User from '../database/models/index.js';
import { generateToken } from '../utils/generateToken.js';
import 'dotenv/config';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALL_BACK_URL,
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.User.findOne({
          where: { email: profile.emails[0].value },
        });
        console.log(existingUser)
        if (existingUser) {
          existingUser.isEmailVerified = true;
          await existingUser.save();
          const { firstname, email, role } = existingUser;
          const person = { firstname, email, role };
          const token = generateToken(person);
          return done(null, { existingUser, token });
        } else {
          const error = 'user not found!';
          return done(error, null);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.email);
});
passport.deserializeUser((email, done) => {
  User.User.findOne({ where: email })
    .then((user) => done(null, user))
    .catch((err) => done(err));
});


