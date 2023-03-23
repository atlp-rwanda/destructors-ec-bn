import { Router } from "express";
import { registerUser, loginUser,resetEmail, resetPassword,editUserProfile,logoutUser} from "../../controllers/user.controller";
import verifyUser from "../../middlewares/verifyUser";
import signupValidation from "../../ validations/signup.validation";
import userValdation from '../../ validations/login.validation';
import passport from "passport";
import {googleAuthentication,googleCallBack} from "../../controllers/googleCallBack.js"
import "../../services/googleAuth"
import {resetPasswordValidation, EmailValidation} from "../../ validations/resetPassword.validation.js";
import extractToken from '../../middlewares/checkUserWithToken';
import { editUserProfil } from "../../ validations/user.validations";

const route = Router();
route.post("/signup", signupValidation, verifyUser, registerUser);
route.post('/login',userValdation,loginUser);
route.post("/reset-password",EmailValidation, resetEmail);
route.patch("/reset-password/:token", resetPasswordValidation, resetPassword);

route.get('/auth',(req,res)=>{
    res.status(200).send('<a href="/api/v1/users/login/google">do you want to access your account</a>')
})
route.get('/login/google',googleAuthentication);
route.get('/google/callback', passport.authenticate('google'),googleCallBack)
route.put('/profile',extractToken,editUserProfil,editUserProfile);
route.put('/profile',extractToken,editUserProfile);
route.post('/logout',extractToken,logoutUser)

export default route;
