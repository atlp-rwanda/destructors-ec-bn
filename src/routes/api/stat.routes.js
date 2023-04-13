import {Router} from 'express';
import GetSellerStats from '../../controllers/stats.controller.js';
const router = Router()

router.get('/:sellerId',GetSellerStats) 
   
export default router