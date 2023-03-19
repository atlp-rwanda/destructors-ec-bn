import { Router } from "express";
import { registerUser } from "../../controllers/user.controller";
import verifyUser from "../../middlewares/verifyUser";
import signupValidation from "../../ validations/signup.validation";
const route = Router();

route.post("/signup", signupValidation, verifyUser, registerUser);
// route.get('/validate/:token', OTPverify)



export default route;
