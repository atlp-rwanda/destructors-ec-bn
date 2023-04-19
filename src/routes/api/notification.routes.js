import { notificationFile } from "../../controllers/notifications.controller.js";
import express from 'express';
const route = express.Router();


route.get('/', notificationFile );

export default route;