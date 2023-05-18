import User from "../database/models/index";
import jwt from "jsonwebtoken"
import { generateToken } from "../utils/generateToken";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import 'dotenv/config'
import passport from "passport";



const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const adminData = await User.User.findOne({where: {email: jwt_payload.data.email}})
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
try{
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
      return res.status(500).json({ error:"enter valid uuid" });
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
try{
const selectedUser = await User.User.findOne({where:{ id: req.params.id}});

    if (!selectedUser) {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    return res.status(500).json({ error:"enter valid uuid" });
  }
    const { newRole } = req.body;

    if (!["admin", "seller"].includes(newRole)) {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    const updatedUser = await User.User.update(
      { role: newRole },
      { where: { id: req.params.id } }
    );


    return res.status(200).json({ user:"new role assigned succeessfully "}); 
    })(req, res);
  } catch (error) {
    return res.status(500).json({ status: 500, error: "Server error" });
  }
};


export { updateUserStatus, assignUserRole};