import express from 'express';
import {
  addToCart,
  clearCart,
  viewCart,
} from '../../controllers/cart.controller';
import {
  getUserCart,
  addProductToCart,
  isProductExpired,
  isProductAvailable,
} from '../../middlewares/cart.middleware';
import { cartValidation } from '../../ validations/cart.validation';
import checkRole from '../../middlewares/checkRole';
import extractToken from '../../middlewares/checkUserWithToken';
import { checkIfPasswordIsExpired } from '../../middlewares/checkPassword';

const route = express.Router();

route.post(
  '/',
  extractToken,
  checkRole(['buyer']),
  cartValidation,
  checkIfPasswordIsExpired,
  isProductAvailable,
  isProductExpired,
  getUserCart,
  addProductToCart,
  addToCart
);
route.get('/', extractToken, checkIfPasswordIsExpired,checkRole(['buyer']), getUserCart, viewCart);
route.put('/', extractToken, checkIfPasswordIsExpired,checkRole(['buyer']), getUserCart, clearCart); //check if cart is empty

export default route;
