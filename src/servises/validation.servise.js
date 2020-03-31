import { validationResult } from 'express-validator';

export function check_validator(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success:false,error:{name:"Validation error",message:errors.array()[0].msg}});
  }
  return next();
}
