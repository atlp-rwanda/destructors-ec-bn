import passport from 'passport';
import {
  register, findUserByEmail, logout, findAllUsers,
  findUserById
} from '../services/user.service';
import { generateToken } from '../utils/generateToken';
import model, { User, OTP } from '../database/models';
import { BcryptUtil } from '../utils/bcrypt';

import 'dotenv/config';
import verfyToken from '../utils/verifytoken';
import { request } from 'express';

import {
  sendVerificationEmail,
  sendEmail,
} from '../services/sendEmail.service';
import generateOTP from '../utils/generateOTP';

import validOTPmail from '../services/emailValidation.service';
import { now } from 'lodash';

const registerUser = async (req, res) => {
  try {
    const {
      firstname, lastname, email, password, role, isActive
    } = req.body;

    const userData = {
      firstname,
      lastname,
      email,
      password,
      role,
      isActive,
    };
    const token = generateToken(userData, { expiresIn: '10m' });
    await sendVerificationEmail(email, lastname, token);
    const response = await register(userData);
    return res
      .status(201)
      .json({
        message:
          'Successful registered.Please check your email for verification',
        user: response,
        token,
      });
  } catch (error) {
    return res.status(500).json({ status: 500, error: 'Server error' });
  }
};

const verifyEmail = async (req, res) => {
  const { t: token } = req.query;
  try {
    const decodedToken = verfyToken(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      where: { email: decodedToken.data.email },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      return res.status(419).json({ message: 'Token expired' });
    }
    if (user.isEmailVerified == true) {
      return res.status(200).send({ message: 'Email already verified' });
    }
    user.isEmailVerified = true;
    await user.save();
    return res.status(200).send({ message: 'email verified' });
  } catch (err) {
    return res.status(500).send({ err: 'something went wrong' });
  }
};
const loginUser = async (req, res, next) => {
  passport.authenticate('local', async (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(403).json({ message: 'Invalid email or password' });
    }

    try {
      const foundUser = await User.findOne({ where: { email: user.email } });
      if (!foundUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (foundUser.isEmailVerified == false) {
        console.log({ message: foundUser.esEmailVerified });
        return res.status(403).json({ message: 'Please verify your email' });
      }
      const passwordMatches = await BcryptUtil.compare(
        req.body.password,
        user.password
      );

      if (!passwordMatches) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      const UserToken = {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        expired: user.expired,
      };
      const token = generateToken(UserToken);
      const otp = generateOTP();
      if (foundUser.role == 'seller') {
        OTP.otp = otp;
        await OTP.create({
          otp,
          email: foundUser.email,
        });
        try {
          await validOTPmail(foundUser, otp, token);
          return res
            .status(200)
            .json({ message: 'please verify your email...'});
        } catch (error) {
          res.status(500).json({ message: 'Error sending OTP code' });
        }
      }

      if (foundUser.role == 'admin' || foundUser.role == 'buyer') {
        if (foundUser.expired) {
          return res.status(200).json({
            message: 'Successful login!! your password has expired⚠️⚠️',
            user: {
              id: foundUser.id,
              firstname: foundUser.firstname,
              lastname: foundUser.lastname,
              email: foundUser.email,
              role: foundUser.role,
            },
            token,
          });
        }
        return res.status(200).json({
          message: 'Successful login',
          user: {
            id: foundUser.id,
            firstname: foundUser.firstname,
            lastname: foundUser.lastname,
            email: foundUser.email,
            role: foundUser.role,
          },
          token,
        });
      }
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};

const resetEmail = async (req, res) => {
  try {
    const userEml = req.body.email;
    const user = await findUserByEmail(userEml);
    if (user == false) {
      res.status(404).json({ message: 'User not found' });
    } else {
      const userDetails = {
        email: user.email,
        id: user.id,
      };
      const userToken = generateToken(userDetails, { expiresIn: '10m' });
      const sendToEmail = req.body.email;
      const link = `${process.env.FRONTEND_URL}auth/reset-password?token=${userToken}`;
      const HTMLText = `<html>
         <head>
         <style>
            .container {
              border: 2px;
            }
            .button {
              background-color: #2D719D;
              padding: 10px 20px;
              text-decoration: none;
              font-weight: bold;
              border-radius: 4px;
            }
            img{
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .header{
              background-repeat: no-repeat;
              background-size: fit;
              width: 100%;
              height: 120px;
            }
            a{
              text-decoration: none;
              color: white;
            }
            span{
              color: #fff;
            }
          </style>
        </head>
        <body>
        <div style='font-size: 12px'><strong> <h3>Hi ${user.lastname}<h3/><br> <br>
         <div class = "header">
         <img src='https://d1u4v6449fgzem.cloudfront.net/2020/03/The-Ecommerce-Business-Model-Explained.jpg' alt='header'/>
         </div><br> <br>
         <div class="container">
         <h3>Please click  here to reset your password.</h3>
         <a href="${link}" class="button"><span>Reset Password</span></a>
         </div>
         <br> <br>Remember, beware of scams and keep this one-time verification link confidential.<br>
         </strong><br> DESTRUCTORS </div>
         </body>
         </html>
       `;

      await sendEmail(sendToEmail, 'Reset password', HTMLText);

      res
        .status(200)
        .json({
          message: 'Reset password email has been sent, check your inbox',
        });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const payload = verfyToken(token, process.env.JWT_SECRET);

    if (payload) {
      const hashPassword = BcryptUtil.hash(req.body.password);
     await model.User.update(
        {
          password: hashPassword,
          lastTimePasswordUpdated: new Date(),
          expired: false,
        },
        {
          where: { email: payload.data.email },
        }
      );
      res.status(200).json({ message: 'Password changed successfully' });
    } else {
      res.status(400).json({ message: 'Token has expired' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await findUserById(userId);
    if (user) {
      res.status(200).json({ user_details: user });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
const editUserProfile = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const decodeUser = await findUserByEmail(userEmail);

    if (!decodeUser) return res.status(401).json('user not found');
    let billingAddress;
    billingAddress = JSON.stringify({
      province: req.body.province,
      district: req.body.district,
      street: req.body.street,
      phoneNo: req.body.phoneNo,
      email: req.body.email,
    });
    let profilePic;
    if (req.body.gender === 'male') {
      profilePic = 'https://res.cloudinary.com/ddsml4rsl/image/upload/v1679487826/icons8-administrator-male-90_dlmsde.png';
    }
    if (req.body.gender === 'female') {
      profilePic = 'https://res.cloudinary.com/ddsml4rsl/image/upload/v1679487628/icons8-female-user-150_lwhby0.png';
    }
    const user = await User.update(
      {
        DOB: req.body.DOB,
        gender: req.body.gender,
        prefferedLanguage: req.body.prefferedLanguage,
        prefferedCurrency: req.body.prefferedCurrency,
        billingAddress: JSON.parse(billingAddress),
        profilePic,
      },
      { where: { id: decodeUser.id } }
    );
    res.status(200).json({ message: 'User profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const logoutUser = async (req, res) => {
  try {
    await logout(req.headers.authorization);
    return res.status(200).json({
      message: 'Successfully logged out.',
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await findUserById(userId);

    const { currentPassword, newPassword, confirmPassword } = req.body;
    // Check current password
    const comparePassword = await BcryptUtil.compare(
      currentPassword,
      user.password
    );
    if (!comparePassword) {
      return res
        .status(401)
        .json({ success: false, error: 'Current password is incorrect' });
    }

    // Check new password
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, error: 'Passwords do not match' });
    }
    const hashedPassword = await BcryptUtil.hash(newPassword);

    user.password = hashedPassword;
    user.lastTimePasswordUpdated = new Date();
    user.expired = false;
    await user.save();

    res.status(200).json({
      success: true,
      data: 'Password updated successfully',
    });
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'you are not Authorized!' });
    }
    const users = await findAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({
      message: 'server Error!',
      error: error.message.replace(/[^a-zA-Z0-9 ]/g, '')
    });
  }
};
export {
  registerUser,
  resetEmail,
  resetPassword,
  loginUser,
  editUserProfile,
  logoutUser,
  updatePassword,
  verifyEmail,
  getAllUsers,
  getUserProfile,
};
