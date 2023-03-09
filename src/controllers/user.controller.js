import { register } from '../services/user.service.js';
import { generateToken } from '../utils/generateToken.js';

const registerUser = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      role,
      isActive
    } = req.body;

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
      .json({ message: 'Successful registered', user: response, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, error: 'Server error' });
  }
};

export default registerUser;
