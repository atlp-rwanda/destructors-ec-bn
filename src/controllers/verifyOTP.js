import { Op } from 'sequelize';
import { User, OTP, Blacklist } from '../database/models';
import verfyToken from '../utils/verifytoken';
import 'dotenv/config';
import { generateToken } from '../utils/generateToken';
const verifyOTP = async (req, res) => {
  try {
    const token = req.params.token;
    const blacklistToken = await Blacklist.findOne({ where: { token } });
    if (blacklistToken) {
      return res
        .status(401)
        .json({ message: 'please generate another token!' });
    }
    const verToken = verfyToken(token, process.env.JWT_SECRET);
    if (!verToken) {
      return res.status(401).json({ message: 'unauthorized' });
    }
    const { otp } = req.body;
    const user = await OTP.findOne({
      where: {
        otp: otp,
        createdAt: {
          [Op.gte]: new Date(new Date() - 10 * 60 * 1000),
        },
      },
    });
    if (!user) {
      return res.status(401).json({ message: 'invalid OTP!' });
    }
    user.otp = null;
    const payload = {
      id: verToken.data.id,
      email: verToken.data.email,
      role: verToken.data.role,
      isActive: verToken.data.isActive,
    };

    const tokenOTP = generateToken(payload);
    await user.destroy();

    res
      .status(200)
      .json({ message: 'logged in successfully', token: tokenOTP });
    await Blacklist.create({ token });
  } catch (err) {
    res.status(500).json({ message: 'server error!', error: err });
  }
};
export default verifyOTP;
