import { Router } from 'express';
import extractToken from '../../middlewares/checkUserWithToken';
import trackOrderStatus from '../../controllers/orderStatus.controller';

const route = Router();

route.get('/:id/status', extractToken, trackOrderStatus);

export default route;
