export default function (req, res, next) {
  if (!req.session.isAuthenticated) {
    const error = 'Trying to get unaccessible data';
    res.status(400).json({ success: false, error });
    return next(new Error(error));
  }
  return next();
}
