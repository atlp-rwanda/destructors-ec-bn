// eslint-disable-next-line require-jsdoc
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('auth/login');
}
export default isAuthenticated;
