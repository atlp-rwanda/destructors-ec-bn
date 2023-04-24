import { Router } from 'express';
import extractToken from '../../middlewares/checkUserWithToken';
import {
  trackOrderStatus,
  getOrders,
} from '../../controllers/orderStatus.controller';

const route = Router();

route.get('/all', extractToken, getOrders);

route.get('/:id/status', extractToken, trackOrderStatus);

export default route;
