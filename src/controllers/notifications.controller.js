import { findProducts } from "../services/product.service";
import path from "path"; 
export const notificationFile = (req, res) => {
   res.sendFile(path.join(__dirname, '../public', 'notifications.html'))
}


