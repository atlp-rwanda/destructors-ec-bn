/* eslint-disable no-shadow */
import generateToken from '../utils/generateToken.js';
import passport from '../config/login-passport.js';

export const loginUser = (req, res, next) => {
  passport.authenticate('local', { session: false }, async (error, user, info) => {
    try {
      if (error) {
        return res.status(500).json({ error });
      }
      if (!user) {
        return res.status(401).json({ error: info.message });
      }
      const token = generateToken(user);
      console.log('token and user', token, user);
      return res.status(200).json({ user, token });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};
export default loginUser;
