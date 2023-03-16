import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import passport from 'passport';
import { config } from 'dotenv';
import User from "../database/models/index.js"
// import identity from '../database/models/index.js';
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
        // const [user] = await User.findOrCreate({
        //   where: { googleId: profile.id },
        //   defaults: {                
        //     name: profile.displayName,
        //     email: profile.emails[0].value,
        //   },
        // });
        // done(null, user);
        const existingUser = await User.User.findOne({ where: {email: profile.emails[0].value} });                            
                            if (existingUser) {
                                // res.send(null, existingUser);
                                const {firstname,email,role}=existingUser
                                const person={firstname,email,role}
              const token=  generateToken(person)
              console.log(token)
                                return done(null, existingUser);
                            }
                            // else {
                            //   // res.send(`<h3>this is the end</h3>`)
                            //   console.log('user not found')
                            // }
      } catch (err) {
        return done(err);
      }
  }
));
passport.serializeUser((user, done) => {
    done(null, user.email);
  });
  
  // passport.deserializeUser((id, done) => {
  //   User.findById(_id).then(user => {
  //     done(null, user);
  //   });
  //   });
  passport.deserializeUser((email, done) => {
    User.User.findOne({ where:  email })
      .then(user => done(null, user))
      .catch(err => done(err));
  });