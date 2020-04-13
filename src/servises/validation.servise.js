import { validationResult } from 'express-validator';

export default function checkValidator(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send(errors.array()[0].msg);
  }
  return next();
}
