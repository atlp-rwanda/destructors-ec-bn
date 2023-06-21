import { Router } from "express";
import {userPayment,stripesuccess} from "../../controllers/payment.controller";
import extractToken from '../../middlewares/checkUserWithToken';
import { getUserCart } from "../../middlewares/cart.middleware";
import { getCartProductInfo } from "../../middlewares/getCartInfo.middleware";
import { checkout } from '../../controllers/mtnPayment.controller.js';

const router = new Router()
router.post('/pay', extractToken,getUserCart,getCartProductInfo,userPayment)
router.get('/success',stripesuccess)
router.post('/transactions',checkout)
export default router