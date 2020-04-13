export default function (req, res, next) {
  if (!req.session.isAuthenticated) {
    return res.status(400).send('You are not logined to do it');
  }
  return next();
}
