import { Router } from 'express';
import extractToken from '../../middlewares/checkUserWithToken';
import {
  trackOrderStatus,
  getOrders,
  getSales
} from '../../controllers/orders.controller';

const route = Router();

route.get('/', extractToken, getOrders);
route.get('/products', extractToken, getSales);

route.get('/:id/status', extractToken, trackOrderStatus);

export default route;
