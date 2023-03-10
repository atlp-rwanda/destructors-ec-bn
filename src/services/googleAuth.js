import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import passport from 'passport';
import { config } from 'dotenv';
import User from "../database/models/index.js"
import { generateToken } from '../utils/generateToken.js';

config()
passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/v1/users/google/callback",
    passReqToCallback  : true
  },
  async (request, accessToken, refreshToken, profile, done)=> {
    try {

        const existingUser = await User.User.findOne({ where: {email: profile.emails[0].value} });                            
                            if (existingUser) {
                                const {firstname,email,role}=existingUser
                                const person={firstname,email,role}
              const token=  generateToken(person)
                                return done(null,{existingUser,token});
                            }
                          
                            else{
                              const error="user not found!";
                              return done(error,null)
                            }

      } catch (err) {
        return done(err);
      }
  }
));
passport.serializeUser((user, done) => {
    done(null, user.email);
  });
  passport.deserializeUser((email, done) => {
    User.User.findOne({ where:  email })
      .then(user => done(null, user))
      .catch(err => done(err));
  });