import { Router } from "express";
import { registerUser, userProfile } from "../../controllers/user.controller";
import verifyUser from "../../middlewares/verifyUser";
import signupValidation from "../../ validations/signup.validation";
const route = Router();

route.post("/signup", signupValidation, verifyUser, registerUser);
//user profile change
route.put('/profile',userProfile);
export default route;
