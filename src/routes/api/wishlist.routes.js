import {
  addWishlist,
  getProductWished,
} from '../../controllers/wishlist.controller';
import { Router } from 'express';
import extractToken from '../../middlewares/checkUserWithToken';
import { prodWishValidation } from '../../ validations/wishlist.validation';
import checkRole from '../../middlewares/checkRole';
const router = Router();

router.post('/', extractToken, prodWishValidation, addWishlist);
router.get('/', extractToken, getProductWished);
export default router;
