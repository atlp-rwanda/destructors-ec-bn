import "../services/googleAuth.js";
import passport from "passport";

const googleAuthentication = (req, res, next) => {
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })(req, res, next);
};

const googleCallBack = (req, res) => {
  const { user, token } = req.user;

  res.setHeader("Authorization", `Bearer ${token}`);

  res.redirect("http://localhost:5173/home"); 
};

export { googleAuthentication, googleCallBack };
