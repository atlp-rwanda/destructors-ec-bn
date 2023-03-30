import { Router } from 'express';
import { createProducts, retrieveItem, retrieveItems } from '../../controllers/product.controller.js';
import { productValidation } from '../../ validations/product.validation.js';
import {
  isCategoryExist,
  isProductExist,
  uploadArray,
} from '../../middlewares/product.middleware.js';
import checkRole from '../../middlewares/checkRole.js';
import extractToken from '../../middlewares/checkUserWithToken.js';

const route = Router();

route.post(
  '/',
  extractToken,
  checkRole(['seller']),
  uploadArray('image'),
  productValidation,
  isCategoryExist,
  isProductExist,
  createProducts
);

route.get('/:id', extractToken, retrieveItem);
route.get('/', extractToken, retrieveItems);

export default route;
