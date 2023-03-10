import { Router } from "express";
import { registerUser } from "../../controllers/user.controller";
import verifyUser from "../../middlewares/verifyUser";
const route = Router();

route.post("/signup", verifyUser, registerUser);

export default route;
