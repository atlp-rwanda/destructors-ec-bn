import express from 'express';
import user from './api/user.routes.js';
import product from './api/products.routes.js';
import updatePassword from './api/user.routes';


const routes = express.Router();
routes.use('/users', user);
routes.use('/products', product);
routes.use('/users', updatePassword);


export default routes;
