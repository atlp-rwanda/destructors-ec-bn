import express from 'express';
import user from './api/user.routes';
import update from './api/updatePassword.routes';

const routes = express.Router();

routes.use('/users', user);
routes.use('/users', update);

export default routes;
