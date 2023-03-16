import express from 'express';
import user from './api/user.routes';
import userLogin from './api/userLogin.routes'
const routes = express.Router();
routes.use('/users', user);
routes.use('/users',userLogin)
export default routes;
