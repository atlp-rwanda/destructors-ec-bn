import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import passport from 'passport';
import { config } from 'dotenv';
import User from "./database/models/index.js"
config()
passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback",
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
        const existingUser = await User.newUser.findOne({ where: {'googleId': profile.id} });
                            
                            if (existingUser) {

                                // res.send(null, existingUser);
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
    done(null, user.id);
  });
  
  // passport.deserializeUser((id, done) => {
  //   User.findById(_id).then(user => {
  //     done(null, user);
  //   });
  //   });
  passport.deserializeUser((googleId, done) => {
    User.newUser.findOne({ where:  googleId  })
      .then(user => done(null, user))
      .catch(err => done(err));
  });