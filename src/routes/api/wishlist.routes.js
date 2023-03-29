import { addWishlist } from "../../controllers/wishlist.controller";
import { Router } from "express";
import extractToken from "../../middlewares/checkUserWithToken"
const router=Router()

router.post('/',extractToken,addWishlist)
export default router