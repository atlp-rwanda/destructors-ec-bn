import express from 'express';
import user from './api/user.routes.js';
import product from './api/products.routes.js';
import updatePassword from './api/user.routes';
import cart from './api/cart.routes.js';
import wishlist from './api/wishlist.routes';
import chat from './api/chat.routes';
import payment from './api/payment.routes.js';
import sale from './api/sale.routes.js';
import stat from './api/stat.routes';
import notification from './api/notification.routes.js';
import category from './api/category.routes.js';
import orders from './api/orders.routes.js';
import saleDetails from './api/salesDetails.routes.js';
import invoice from './api/invoice.routes.js';

const routes = express.Router();
routes.use('/', payment);
routes.use('/users', user);
routes.use('/products', product);
routes.use('/users', updatePassword);
routes.use('/carts', cart);
routes.use('/product-wishes', wishlist);
routes.use('/product-wishes', wishlist);
routes.use('/categories', category);

routes.use('/chats', chat);
routes.use('/sales', sale);
routes.use('/stats', stat);
routes.use('/notifications', notification);
routes.use('/orders', orders);
routes.use('/sales-details', saleDetails);
routes.use('/doc', invoice);

export default routes;
