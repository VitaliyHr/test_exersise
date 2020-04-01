import { body, param } from 'express-validator';

export const loginvalidator = [
  body('email').isEmail().trim().normalizeEmail().withMessage('Wrong email'),
  body('password').isLength({ min: 3 }).trim().withMessage('Min length is 3'),
];

export const registervalidator = [
  body('email').isEmail().normalizeEmail().trim().withMessage('It\'s not email'),
  body('password').isLength({ min: 3 }).trim().withMessage('Min length is 3'),
  body('confirm').custom((confirm,{req})=>{
    if(confirm!==req.body.password){
      throw new Error("Password and confirm is not equal");
    }
    return true;
  })
];

export const addBookVal = [
  body('title').isString().trim().notEmpty().withMessage('Invalid title'),
  body('author').isString().trim().notEmpty().withMessage('Invalid author'),
  body('isFinished').isBoolean().withMessage('is Finished only true or false'),
  body('notes').isString().trim().withMessage('notes must be a String'),
];


export const patchbook = [
  body('title').isString().trim().notEmpty().withMessage('Invalid title'),
  body('author').isString().trim().notEmpty().withMessage('Invalid author'),
  body('isFinished').isBoolean().withMessage('is Finished only true or false'),
  body('notes').isString().trim().withMessage('notes must be String'),
  body('userId').isMongoId().withMessage('it must be a mongo db id')
];

export const ParamsValidator = [
  param('id').isMongoId().withMessage("Wrong url")
]