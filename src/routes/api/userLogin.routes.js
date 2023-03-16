import { Router } from "express";
import passport from "passport";
import isLoggedIn from "../../middlewares/isLoggedIn";
import isProtected from "../../middlewares/isProtected";
import notValid from "../../middlewares/userNotValid";
const router=Router()

router.get('/',(req,res)=>{
    res.send('<a href="/api/v1/users/login">do you want to access your account</a>')
})
//this is for authentication of the user
router.get('/login',
passport.authenticate('google',
{scope:['email','profile']}));

//this is the google application that redirect the user where to dgo after succeeding or failing
router.get('/google/callback',passport.authenticate('google',{
  successRedirect:'/api/v1/users/protected',
  failureRedirect:'/api/v1/users/failure'}))

//this is after success
router.get("/protected",isLoggedIn,isProtected)
router.get("/failure",notValid)
router.get('/logout', (req, res)=>{
    req.logout(function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  });
export default router