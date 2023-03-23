import express from 'express';
import user from './api/user.routes.js';
import product from './api/products.routes.js';


const routes = express.Router();
routes.use('/users', user);
routes.use('/products', product);


export default routes;
