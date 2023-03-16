import express from 'express';
import user from './api/user.routes.js';
import product from './api/products.routes.js';
import reset from './api/resetPassword.routes';

const routes = express.Router();
routes.use('/users', user);
routes.use('/products', product);
routes.use('/users',reset);

export default routes;
