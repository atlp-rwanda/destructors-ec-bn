import { Router } from 'express';
import checkRole from '../../middlewares/checkRole';
import {changeSaleStatus, getSales } from '../../controllers/sale.controller';
import extractToken from '../../middlewares/checkUserWithToken';
import { checkIfPasswordIsExpired } from '../../middlewares/checkPassword';
const route = Router();

route.get('/', extractToken, checkRole(['seller','admin']),getSales );
route.patch('/:id/status',checkIfPasswordIsExpired, extractToken, checkRole(['seller']),changeSaleStatus );

export default route;