import express from 'express';
import categoryValdation from '../../ validations/category.validation';
import {
  addCategories,
  getAllCategories,
} from '../../controllers/category.controller';
import { isCategoryExistByName } from '../../middlewares/category.middleware';
import checkRole from '../../middlewares/checkRole';
import extractToken from '../../middlewares/checkUserWithToken.js';

const route = express.Router();

route.post(
  '/',
  extractToken,
  checkRole(['seller', 'admin']),
  categoryValdation,
  isCategoryExistByName,
  addCategories
);
route.get('/', extractToken, checkRole(['seller', 'admin']), getAllCategories);

export default route;
