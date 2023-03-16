import { Router } from 'express';
import { createProducts } from '../../controllers/product.controller.js';
import { productValidation } from '../../ validations/product.validation.js';
import { isCategoryExist } from '../../middlewares/isCategoryExist.js';
import { isProductExist } from '../../middlewares/isProductExist.js';

const route = Router();

route.post(
  '/',
  productValidation,
  isCategoryExist,
  isProductExist,
  createProducts
);

export default route;
