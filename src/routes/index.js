import express from 'express';
import user from './api/user.routes.js';
import product from './api/products.routes.js';
import updateUserPassword from './api/updatePassword.routes';

const routes = express.Router();
routes.use('/users', user);
routes.use('/products', product);
routes.use('/users', updateUserPassword);
export default routes;
