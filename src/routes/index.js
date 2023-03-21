import express from 'express';
import user from './api/user.routes';
const routes = express.Router();
routes.use('/users', user);
export default routes;
