import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import User from '../models/user';
import catchAsync from '../utils/catchAsync';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findOne({
    where: {
      id: req.user.id,
    },
  });

  // 2) Check if POSTed current password is correct
  const isCurrentPasswordCorrect = await user.comparePassword(
    req.body.passwordCurrent
  );
  if (!isCurrentPasswordCorrect) {
    return next('Your current password is wrong.', 401);
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.lastTimePasswordUpdated = new Date();
  user.mustUpdatePassword = false;
  await user.save();

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});
