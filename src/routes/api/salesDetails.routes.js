import { Router } from 'express';
import extractToken from '../../middlewares/checkUserWithToken';
import {
  getSales
} from '../../controllers/orders.controller';

const route = Router();

route.get('/', extractToken, getSales);

export default route;
