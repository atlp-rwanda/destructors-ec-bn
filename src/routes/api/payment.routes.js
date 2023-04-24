import { Router } from "express";
import {userPayment,stripesuccess} from "../../controllers/payment.controller";
import extractToken from '../../middlewares/checkUserWithToken';
import { getUserCart } from "../../middlewares/cart.middleware";
import { getCartProductInfo } from "../../middlewares/getCartInfo.middleware";
const router = new Router()
router.post('/pay', extractToken,getUserCart,getCartProductInfo,userPayment)
router.get('/success',stripesuccess)
export default router