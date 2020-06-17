import { validationResult } from 'express-validator';

export default function checkValidator(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(404).json({ success: false, error: errors.array()[1].msg });
    return next(errors.array()[1].msg);
  }
  return next();
}
