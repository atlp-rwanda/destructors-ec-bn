import express from 'express';
import user from './api/user.routes.js';
import product from './api/products.routes.js';
import updatePassword from './api/user.routes';
import cart from './api/cart.routes.js';
import wishlist from "./api/wishlist.routes"

const routes = express.Router();
routes.use('/users', user);
routes.use('/products', product);
routes.use('/users', updatePassword);
routes.use('/carts', cart);
routes.use('/product-wishes',wishlist)


export default routes;
