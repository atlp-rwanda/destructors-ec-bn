import User, { Log } from '../database/models/index';
import jwt from 'jsonwebtoken';
import { generateToken } from '../utils/generateToken';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import 'dotenv/config';
import passport from 'passport';
import { Op } from 'sequelize';
import fs from 'fs';


const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const adminData = await User.User.findOne({ where: { email: jwt_payload.data.email } });
    if (!adminData) {
      return done(null, false);
    }
    return done(null, adminData);
  } catch (error) {
    done(error, false);
  }
}));

const updateUserStatus = async (req, res) => {
  try {
    passport.authenticate('jwt', { session: false }, async (err, adminData) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!adminData) {
        return res.status(400).json({ error: 'Enter your credentials as admin' });
      }

      if (adminData.role !== 'admin') {
        return res.status(400).json({ error: 'Only admin users can update user status' });
      }
      try {
        const user = await User.User.findOne({ where: { id: req.params.id } });

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        const updatedIsActive = !user.isActive;
        const updatedUser = await User.User.update(
          { isActive: updatedIsActive },
          { where: { id: req.params.id } }
        );

        return res.status(200).json({ user: updatedIsActive });
      } catch (err) {
        return res.status(500).json({ error: 'enter valid uuid' });
      }
    })(req, res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

const assignUserRole = async (req, res) => {
  try {
    passport.authenticate('jwt', { session: false }, async (err, adminData) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!adminData) {
        return res.status(404).json({ error: 'Enter your credentials as admin' });
      }

      if (adminData.role !== 'admin') {
        return res.status(400).json({ error: 'Only admin users can update user status' });
      }
      try {
        const selectedUser = await User.User.findOne({ where: { id: req.params.id } });

        if (!selectedUser) {
          return res.status(404).json({ error: 'User not found' });
        }
      } catch (err) {
        return res.status(500).json({ error: 'enter valid uuid' });
      }
      const { newRole } = req.body;

      if (!['admin', 'seller', 'buyer'].includes(newRole)) {
        return res.status(400).json({ error: 'Invalid role specified' });
      }

      const updatedUser = await User.User.update(
        { role: newRole },
        { where: { id: req.params.id } }
      );

      return res.status(200).json({ user: 'new role assigned succeessfully ' });
    })(req, res);
  } catch (error) {
    return res.status(500).json({ status: 500, error: 'Server error' });
  }
};

const getLogs = async (req, res) => {
  try {
    passport.authenticate('jwt', { session: false }, async (err, adminData) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!adminData) {
        return res.status(400).json({ error: 'Enter your credentials as admin' });
      }

      if (adminData.role !== 'admin') {
        return res.status(400).json({ error: 'Only admin users can update user status' });
      }

      try {
        const { date, type } = req.body;
        let filter = {};

        let startDate, endDate; // Declare the variables here

        if (date) {
          startDate = new Date(date);
          endDate = new Date(date);
          endDate.setDate(startDate.getDate() + 1);

          filter.timestamp = {
            [Op.gte]: startDate,
            [Op.lt]: endDate,
          };
        }

        if (type) {
          filter.type = type;
        }

        const readFilePromise = new Promise((resolve, reject) => {
          fs.readFile('logs.log', 'utf8', (err, data) => {
            if (err) {
              console.error(err);
              reject(err);
            } else {
              resolve(data);
            }
          });
        });

        const data = await readFilePromise;

        const logs = data
          .split('\n')
          .filter(log => log !== '')
          .map(log => {
            try {
              return JSON.parse(log);
            } catch (error) {
              console.error('Error parsing log:', error);
              return null;
            }
          })
          .filter(log => log !== null)
          .filter(log => {
            if (type && date) {
              return (
                log.type &&
                log.type.match(new RegExp(filter.type, 'i')) &&
                new Date(log.timestamp) >= startDate &&
                new Date(log.timestamp) < endDate 
              );
            } else if (type) {
              return log.type && log.type.match(new RegExp(filter.type, 'i'));
            } else if (date) {
              return (
                log.type &&
                new Date(log.timestamp) >= startDate && // Use the variables here
                new Date(log.timestamp) < endDate // Use the variables here
              );
            }
            return true;
          })
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        if (logs.length === 0) {
          return res.json({ message: 'No data!' });
        }

        return res.json({ logs });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
      }
    })(req, res);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
export { updateUserStatus, assignUserRole, getLogs };
