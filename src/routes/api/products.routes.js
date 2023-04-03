import { Router } from 'express';
import { createProducts , retrieveItem, retrieveItems ,updateProductAvailability,updateProduct, deleteProduct,searchProducts} from '../../controllers/product.controller.js';
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
route.get('/search',extractToken,searchProducts)
route.get('/:id', extractToken, retrieveItem);
route.get('/', extractToken, retrieveItems);
route.patch('/:id/availability',
extractToken,
checkRole(['seller']),
updateProductAvailability,);
route.patch('/:id',extractToken,checkRole(['seller']), updateProduct);
route.delete('/:id',extractToken,checkRole(['seller']), deleteProduct);

export default route;
