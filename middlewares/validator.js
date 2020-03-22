const { body } = require('express-validator');

exports.loginvalidator = [
  body('email').isEmail().trim().normalizeEmail().withMessage('Wrong email'),
  body('password').isLength({ min: 3 }).trim().withMessage('Min length is 3'),
];

exports.registervalidator = [
  body('email').isEmail().normalizeEmail().trim().withMessage('It\'s not email'),
  body('password').isLength({ min: 3 }).trim().withMessage('Min length is 3'),
];

exports.addBookVal = [
  body('title').isString().trim().notEmpty().withMessage('Введіть коректну назву'),
  body('author').isString().trim().notEmpty().withMessage('Введіть коректного автора'),
  body('isFinished').isBoolean().withMessage('is Finished має бути тількт true false'),
  body('notes').isString().trim().withMessage('notes повинні бути типу String'),
];


exports.patchbook = [
  body('title').isString().trim().notEmpty().withMessage('Введіть коректну назву'),
  body('author').isString().trim().notEmpty().withMessage('Введіть коректного автора'),
  body('isFinished').isBoolean().withMessage('is Finished має бути тількт true false'),
  body('notes').isString().trim().withMessage('notes повинні бути типу String'),
  body('userId').isMongoId().withMessage('its must be a mongo db id')
];

