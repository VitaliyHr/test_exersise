import { body, param } from 'express-validator';

export const loginvalidator = [
  body('email').isEmail().trim().normalizeEmail()
    .withMessage('Incorrect email')
    .notEmpty(),
  body('password').isLength({ min: 3 }).trim()
    .withMessage('Min password length is 3')
    .notEmpty(),
];

export const registervalidator = [
  body('email').isEmail().normalizeEmail().trim()
    .withMessage('It\'s not email')
    .notEmpty(),
  body('password').isLength({ min: 3 }).trim()
    .withMessage('Min password length is 3')
    .notEmpty(),
  body('confirm').custom((confirm, { req }) => {
    if (confirm !== req.body.password) {
      throw new Error('Password and confirm is not equal');
    }
    return true;
  }).notEmpty(),
];

export const addBookVal = [
  body('title').isString().trim().notEmpty()
    .withMessage('Invalid title'),
  body('author').isString().trim().notEmpty()
    .withMessage('Invalid author'),
  body('isfinished').isBoolean().notEmpty()
    .withMessage('is Finished only true or false'),
  body('notes').isString().trim().notEmpty()
    .withMessage('notes must be a String'),
];


export const patchbook = [
  body('title').isString().trim().notEmpty()
    .withMessage('Invalid title'),
  body('author').isString().trim().notEmpty()
    .withMessage('Invalid author'),
  body('isfinished').isBoolean()
    .withMessage('is Finished only true or false'),
  body('notes').isString().trim()
    .withMessage('notes must be String'),
  body('userid').isMongoId()
    .withMessage('it must be a mongo db id'),
];

export const ParamsValidator = [
  param('id').isString()
    .withMessage('Incorrect url'),
];

export const PassValidator = [
  body('password').trim().notEmpty().isLength({ min: 3 })
    .withMessage('Incorrect password'),
];
