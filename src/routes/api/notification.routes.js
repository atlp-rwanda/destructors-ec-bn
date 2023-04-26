import { notificationFile } from '../../controllers/notifications.controller.js';
import {
  markNotificationsAsRead,
  markAllNotificationsAsRead,
} from '../../controllers/notifications.controller.js';
import express from 'express';
import extractToken from '../../middlewares/checkUserWithToken.js';

const route = express.Router();
route.get('/', notificationFile);
route.patch('/:id', extractToken, markNotificationsAsRead);
route.patch('/', extractToken, markAllNotificationsAsRead);

export default route;
