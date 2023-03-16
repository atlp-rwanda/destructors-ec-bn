import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/user.js';
import BcryptUtil from '../utils'
const localOptions = { usernameField: 'email' };
const loginCheck = new LocalStrategy(localOptions, async (email, password, done) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return done(null, false, { message: 'Invalid email or password.' });
    }

    const validPassword = BcryptUtil.compare(password, user.password);
    if (!validPassword) {
      return done(null, false, { message: 'Invalid email or password.' });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
});
passport.use(loginCheck);

export default passport;
