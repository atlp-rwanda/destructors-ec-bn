import { Router } from "express";
import passport from "passport";

const isLoggedIn=(req,res,next)=>{
req.user ? next(): res.sendStatus(401);
}

const router=Router()
router.get('/',(req,res)=>{
    res.send('<a href="/auth/google">do you want to access your account</a>')
})
router.get('/auth/google',
passport.authenticate('google',
{scope:['email','profile']}));
router.get('/google/callback',passport.authenticate('google',{
    successRedirect:'/protected',
    failureRedirect:'/auth/failure'
}))
router.get("/protected",isLoggedIn,(req,res)=>{
    res.send(`<h2>welcome to my data</h2><br>${req.user.displayName}`)
    console.log(req.user)
})
router.get('/auth/failure',(req,res)=>{
    res.send('something went wrong.')
})
router.get('/logout', (req, res)=>{
    req.logout(function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  });
export default router