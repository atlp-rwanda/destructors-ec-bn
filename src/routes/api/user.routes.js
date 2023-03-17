import { Router } from "express";
import { registerUser, loginUser} from "../../controllers/user.controller";
import verifyUser from "../../middlewares/verifyUser";
import signupValidation from "../../ validations/signup.validation";
import userValdation from '../../ validations/login.validation';
const route = Router();

route.post("/signup", signupValidation, verifyUser, registerUser);
route.post('/login',userValdation,loginUser);

export default route;
