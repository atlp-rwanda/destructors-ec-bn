import { Router } from 'express';
import {
  createProducts,
  retrieveItem,
  retrieveItems,
  updateProductAvailability,
  updateProduct,
  deleteProduct,
  searchProducts,
  retrieveAllProducts
} from '../../controllers/product.controller.js';
import { getWishesPerProduct } from '../../controllers/wishlist.controller.js';
import { productValidation } from '../../ validations/product.validation.js';
import {
  isCategoryExist,
  isProductExist,
  uploadArray,
} from '../../middlewares/product.middleware.js';
import checkRole from '../../middlewares/checkRole.js';
import extractToken from '../../middlewares/checkUserWithToken.js';
import { checkIfPasswordIsExpired } from '../../middlewares/checkPassword.js';
import { createProductReview, getAllProductReviews } from '../../controllers/productReview.controller.js';
import { validateReviewProduct } from '../../ validations/productReview.validation.js';
import checkIfOrderIsApproved from '../../middlewares/purchasedProduct.middleware.js';

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
route.get('/search', extractToken, searchProducts);
route.get('/public',  retrieveAllProducts);
route.get('/:id', extractToken, retrieveItem);
route.get('/', extractToken, retrieveItems);
route.patch(
  '/:id/availability',
  extractToken,
  checkRole(['seller']),
  updateProductAvailability
);
route.patch('/:id', extractToken, checkRole(['seller']), uploadArray('image'), checkIfPasswordIsExpired, updateProduct);
route.delete('/:id', extractToken, checkRole(['seller']), checkIfPasswordIsExpired, deleteProduct,);
route.get('/:id/product-wishes', extractToken, getWishesPerProduct);
route.post('/:id/reviews', extractToken, checkRole(['buyer']), validateReviewProduct, checkIfOrderIsApproved, createProductReview);
route.get('/:id/reviews', extractToken, checkRole(['buyer', 'seller', 'admin']), getAllProductReviews);
export default route;