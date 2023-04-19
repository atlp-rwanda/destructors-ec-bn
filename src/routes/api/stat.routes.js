import {Router} from 'express';
import GetSellerStats from '../../controllers/stats.controller.js';
const router = Router()

router.get('/',GetSellerStats) 
   
export default router