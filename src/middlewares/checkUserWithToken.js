import { verifyToken } from '../utils/generateToken';
import { User } from '../database/models';
import { Blacklist } from '../database/models';

const extractToken = async (req, res, next) => {
  try {
    if (!req.header('Authorization')) {
      return res.status(401).json({ status: 401, message: 'Please sign in' });
    }
    const token = req.header('Authorization').split(' ')[1];
    const isTokenExist = await Blacklist.findOne({ where: { token } });

    if (isTokenExist)
      return res
        .status(403)
        .json({ message: 'Your session has expired, please login!' });

    const details = verifyToken(token);
    const userExists = await User.findOne({
      where: { email: details.data.email },
    });
    if (!userExists) {
      return res.status(401).json({ status: 401, message: 'User not found!' });
    }
    req.user = userExists;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ status: 401, message: 'No valid credentials' });
  }
};
export default extractToken;
