import { Router } from 'express';
import auth from '../middlewares/auth';
import {
  login,
  register,
  reset,
  getReset,
  SetPass,
  Logout,
} from '../controllers/auth.controller';
import {
  loginvalidator,
  registervalidator,
  ParamsValidator,
  PassValidator,
} from '../middlewares/validator';
import checkValidator from '../servises/validation.servise';
import ErrorHandler from '../middlewares/error.handler';


const router = Router();


router.post('/login', loginvalidator, checkValidator, login, ErrorHandler);

router.post('/register', registervalidator, checkValidator, register, ErrorHandler);

// скинути пароль
router.post('/reset/:id', auth, ParamsValidator, checkValidator, reset, ErrorHandler);

// url для відновлення
router.get('/reset/:token', auth, getReset, ErrorHandler);

// ввод нового паролю
router.put('/password', PassValidator, checkValidator, auth, SetPass, ErrorHandler);

// вийти з аккаунта
router.post('/logout', auth, Logout, ErrorHandler);


export default router;
