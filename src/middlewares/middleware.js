const middleware = (req, res, next) => {
  console.log('This is a middleware function.');
  next();
};

export default middleware;
