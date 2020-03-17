module.exports = function (req, res, next) {
  if (!req.session.isAuthenticated) {
    return res.status(400).json('you must be logined');
  }
  next();
};
