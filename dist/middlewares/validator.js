'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParamsValidator = exports.patchbook = exports.addBookVal = exports.registervalidator = exports.loginvalidator = undefined;

var _expressValidator = require('express-validator');

var loginvalidator = exports.loginvalidator = [(0, _expressValidator.body)('email').isEmail().trim().normalizeEmail().withMessage('Wrong email'), (0, _expressValidator.body)('password').isLength({ min: 3 }).trim().withMessage('Min length is 3')];

var registervalidator = exports.registervalidator = [(0, _expressValidator.body)('email').isEmail().normalizeEmail().trim().withMessage('It\'s not email'), (0, _expressValidator.body)('password').isLength({ min: 3 }).trim().withMessage('Min length is 3'), (0, _expressValidator.body)('confirm').custom(function (confirm, _ref) {
  var req = _ref.req;

  if (confirm !== req.body.password) {
    throw new Error("Password and confirm is not equal");
  }
  return true;
})];

var addBookVal = exports.addBookVal = [(0, _expressValidator.body)('title').isString().trim().notEmpty().withMessage('Invalid title'), (0, _expressValidator.body)('author').isString().trim().notEmpty().withMessage('Invalid author'), (0, _expressValidator.body)('isFinished').isBoolean().withMessage('is Finished only true or false'), (0, _expressValidator.body)('notes').isString().trim().withMessage('notes must be a String')];

var patchbook = exports.patchbook = [(0, _expressValidator.body)('title').isString().trim().notEmpty().withMessage('Invalid title'), (0, _expressValidator.body)('author').isString().trim().notEmpty().withMessage('Invalid author'), (0, _expressValidator.body)('isFinished').isBoolean().withMessage('is Finished only true or false'), (0, _expressValidator.body)('notes').isString().trim().withMessage('notes must be String'), (0, _expressValidator.body)('userId').isMongoId().withMessage('it must be a mongo db id')];

var ParamsValidator = exports.ParamsValidator = [(0, _expressValidator.param)('id').isMongoId().withMessage("Wrong url")];