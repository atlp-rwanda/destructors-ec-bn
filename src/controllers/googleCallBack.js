import "../services/googleAuth.js"
import passport from "passport";
const googleAuthentication=(req, res, next)=>{
    passport.authenticate('google', {
        scope: ['email', 'profile']
      })(req, res, next);
}
const googleCallBack=(req, res)=>{
    const { user, token } = req.user;

    return res.status(200).json({ user, token});
}
export {googleAuthentication,googleCallBack}; 