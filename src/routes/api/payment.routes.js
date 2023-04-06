import { Router } from "express";
import {userPayment} from "../../controllers/payment.controller";
import extractToken from '../../middlewares/checkUserWithToken';
import { getUserCart } from "../../middlewares/cart.middleware";
import { getCartProductInfo } from "../../middlewares/getCartInfo.middleware";
const router = new Router()
router.post('/pay', extractToken,getUserCart,getCartProductInfo,userPayment)
export default router