import { Router } from "express";
import { resetEmail, resetPassword } from "../../controllers/reset-password";
import resetPasswordValidation from "../../ validations/resetPassword.validation";


const route = Router();

route.get("/reset-password", resetEmail);
route.patch("/reset-password/:token",resetPasswordValidation, resetPassword);
export default route;
