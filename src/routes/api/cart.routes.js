import express from 'express';
import {
  addToCart,
  clearCart,
  removeFromCart,
  viewCart,
} from '../../controllers/cart.controller';
import {
  getUserCart,
  addProductToCart,
  isProductExpired,
  isProductAvailable,
  checkProductInCart,
} from '../../middlewares/cart.middleware';
import { cartValidation } from '../../ validations/cart.validation';
import checkRole from '../../middlewares/checkRole';
import extractToken from '../../middlewares/checkUserWithToken';
import { checkRoleCart } from '../../middlewares/checkRole';

const route = express.Router();

route.post(
  '/',
  extractToken,
  checkRole(['buyer']),
  cartValidation,
  isProductAvailable,
  isProductExpired,
  getUserCart,
  addProductToCart,
  addToCart
);
route.get('/', extractToken, checkRoleCart(['buyer']), getUserCart, viewCart);
route.put('/', extractToken, checkRole(['buyer']), getUserCart, clearCart);
route.patch(
  '/:productId',
  extractToken,
  checkRole(['buyer']),
  getUserCart,
  checkProductInCart,
  removeFromCart
);

export default route;
