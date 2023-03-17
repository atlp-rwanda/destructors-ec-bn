import { register } from "../services/user.service";
import { generateToken } from "../utils/generateToken";
import passport from 'passport';
import { User } from '../database/models';
import { BcryptUtil } from '../utils/bcrypt';

const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, role, isActive } = req.body;

    const userData = {
      firstname,
      lastname,
      email,
      password,
      role,
      isActive,
    };
    const token = generateToken(userData);
    const response = await register(userData);
    return res
      .status(201)
      .json({ message: "Successful registered", user: response, token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, error: "Server error" });
  }
};
const loginUser = async (req, res, next) => {
  passport.authenticate('local', async (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    try {
      const foundUser = await User.findOne({ where: { email: user.email } });
      if (!foundUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      const passwordMatches = await BcryptUtil.compare(req.body.password, user.password);

      if (!passwordMatches) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      const UserToken = {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        mustUpdatePassword: user.mustUpdatePassword,
        lastTimePasswordUpdated: user.lastTimePasswordUpdated
      };
      const token = generateToken(UserToken);

      return res.status(200).json({
        message: 'Successful login',
        user: {
          id: foundUser.id,
          firstname: foundUser.firstname,
          lastname: foundUser.lastname,
          email: foundUser.email,
          role: foundUser.role,
        },
        token: token,
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};
export { registerUser, loginUser };
