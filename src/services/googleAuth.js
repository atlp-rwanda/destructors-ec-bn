import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import passport from 'passport';
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
        console.log(profile)
        const existingUser = await User.User.findOne({
          where: { email: profile.emails[0].value },
        });
        if (existingUser) {
          if(existingUser.provider!='google'){
            const message="only google authenticated users!"
            return done(message,null)
          }
          existingUser.isEmailVerified = true;
          await existingUser.save();
          const {id, firstname, email, role } = existingUser;
          const person = { id,firstname, email, role };
          const token = generateToken(person);
          return done(null, { existingUser, token });
        } else {
          const newUser=await User.User.create({
            firstname:profile.given_name,
            lastname:profile.family_name,
            profilePic: profile.picture,
            email:profile.email,
            isEmailVerified: true,
            provider:'google'
          })
          const {id, firstname, email, role } = newUser;
          const newPerson = { id,firstname, email, role };
          const token=generateToken(newPerson)
          return done(null,{newUser,token})
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


