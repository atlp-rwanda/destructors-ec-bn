import { Router } from 'express';
import passport from 'passport';
import isAuthenticated from '../../middlewares/isauthenticated.js';

const LoginRouter = Router();

LoginRouter.get('/protected-route', isAuthenticated);
LoginRouter.post('/users/login', passport.authenticate('local'), (req, res) => {
  res.redirect('/protected-route');
});

export default LoginRouter;
