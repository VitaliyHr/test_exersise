"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.check_validator = check_validator;

var _expressValidator = require("express-validator");

function check_validator(req, res, next) {
  var errors = (0, _expressValidator.validationResult)(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, error: { name: "Validation error", message: errors.array()[0].msg } });
  }
  return next();
}