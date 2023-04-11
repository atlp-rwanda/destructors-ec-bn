import { Router } from 'express';
import checkRole from '../../middlewares/checkRole';
import changeSaleStatus from '../../controllers/sale.controller';
import extractToken from '../../middlewares/checkUserWithToken';
const route = Router();


route.patch('/:id/status', extractToken, checkRole(['seller']),changeSaleStatus );
export default route;