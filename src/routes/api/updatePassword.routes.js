import express from 'express';
import { updatePassword } from '../../controllers/user.controller';
import updatePasswordValidation from '../../ validations/updatePassword.validation';
import extractToken from '../../middlewares/checkUserWithToken';

const router = express.Router();

router.patch(
  '/update-password',
  extractToken,
  updatePasswordValidation,
  updatePassword
);

export default router;
