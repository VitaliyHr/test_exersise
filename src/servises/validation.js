import { validationResult } from 'express-validator';

export default function checkValidator(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(404).json({ success: false, error: errors.array()[0].msg });
    return next(new SyntaxError(errors.array()[0].msg));
  }
  return next();
}
