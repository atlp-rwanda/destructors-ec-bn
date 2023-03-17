import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user';

// Configure passport to use JWT strategy
const options = {
  jwtFromRequest: ExtractJwt.fromBodyField('token'),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(options, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

// Middleware to check if user is authenticated
export const protect = (req, res, next) => {
  const token = req.body.token;
  passport.authenticate('jwt', { session: false })(req, res, next);
};

// Middleware to restrict access to certain users
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action.',
      });
    }
    next();
  };
};
