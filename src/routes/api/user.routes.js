import { Router } from "express";
import { registerUser, loginUser} from "../../controllers/user.controller";
import verifyUser from "../../middlewares/verifyUser";
import signupValidation from "../../ validations/signup.validation";
import userValdation from '../../ validations/login.validation';
import passport from "passport";
import {googleAuthentication,googleCallBack} from "../../controllers/googleCallBack.js"
import "../../services/googleAuth"

const route = Router();
route.post("/signup", signupValidation, verifyUser, registerUser);
route.post('/login',userValdation,loginUser);

route.get('/auth',(req,res)=>{
    res.status(200).send('<a href="/api/v1/users/login/google">do you want to access your account</a>')
})
route.get('/login/google',googleAuthentication);
route.get('/google/callback', passport.authenticate('google'),googleCallBack)
export default route;
