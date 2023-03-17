import express from 'express';
import { updatePassword } from '../../controllers/updatePassword.controller';
import updatePasswordValidation from '../../ validations/updatePassword.validation';
import { protect } from '../../middlewares/authMiddleware';

const router = express.Router();

router.patch(
  '/update-password',
  protect,
  updatePasswordValidation,
  updatePassword
);

export default router;
