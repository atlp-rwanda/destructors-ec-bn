import { Router } from 'express';
import {
  registerUser,
  loginUser,
  resetEmail,
  resetPassword,
  editUserProfile,
  logoutUser,
  verifyEmail,
  getUserProfile
} from '../../controllers/user.controller';
import verifyUser from '../../middlewares/verifyUser';
import signupValidation from '../../ validations/signup.validation';
import userValdation from '../../ validations/login.validation';
import passport from 'passport';
import {
  googleAuthentication,
  googleCallBack,
} from '../../controllers/googleCallBack.js';
import '../../services/googleAuth';
import {
  resetPasswordValidation,
  EmailValidation,
} from '../../ validations/resetPassword.validation.js';
import extractToken from '../../middlewares/checkUserWithToken';
import { editUserProfil } from '../../ validations/user.validations';
import {
  assignUserRole,
  updateUserStatus,
} from '../../controllers/admin.controller';
import updatePasswordValidation from '../../ validations/updatePassword.validation';
import { updatePassword } from '../../controllers/user.controller';
import verifyOTP from '../../controllers/verifyOTP';
import { checkIfPasswordIsExpired } from '../../middlewares/checkPassword';

const route = Router();
route.post('/signup', signupValidation, verifyUser, registerUser);
route.post('/login', userValdation, loginUser);
route.post('/reset-password', EmailValidation, resetEmail);
route.patch('/reset-password/:token', resetPasswordValidation, resetPassword);
route.patch(
  '/update-password',
  extractToken,
  updatePasswordValidation,
  updatePassword
);

route.post('/login/validate/:token', verifyOTP);
route.get('/auth', (req, res) => {
  res
    .status(200)
    .send(
      '<a href="/api/v1/users/login/google">do you want to access your account</a>'
    );
});
route.get('/verify-email', verifyEmail);
route.get('/login/google', googleAuthentication);
route.get('/google/callback', passport.authenticate('google'), googleCallBack);
route.put(
  '/profile',
  extractToken,
  checkIfPasswordIsExpired,
  editUserProfil,
  editUserProfile
);
route.get(
  '/profile',
  extractToken,
  checkIfPasswordIsExpired,
  editUserProfil,
  getUserProfile
);
route.post('/logout', extractToken, logoutUser);
route.patch('/:id/status', checkIfPasswordIsExpired, updateUserStatus);
route.patch('/:id/roles', checkIfPasswordIsExpired, assignUserRole);

export default route;
