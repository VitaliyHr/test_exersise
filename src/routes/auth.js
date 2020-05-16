import { Router } from 'express';
import auth from '../middlewares/auth';
import {
  login,
  register,
  reset,
  getReset,
  SetPass,
  Logout,
} from '../controllers/auth';
import {
  loginvalidator,
  registervalidator,
  ParamsValidator,
  PassValidator,
} from '../middlewares/validator';
import checkValidator from '../servises/validation';
import ErrorHandler from '../middlewares/error';


const CreateRouter = () => {
  const router = Router();


  router.post('/login', loginvalidator, checkValidator, login, ErrorHandler);

  router.post('/register', registervalidator, checkValidator, register, ErrorHandler);

  // скинути пароль
  router.post('/change/:id', auth, ParamsValidator, checkValidator, reset, ErrorHandler);

  // url для відновлення
  router.get('/change/:token', auth, getReset, ErrorHandler);

  // ввод нового паролю
  router.put('/password', PassValidator, checkValidator, auth, SetPass, ErrorHandler);

  // вийти з аккаунта
  router.post('/exit', auth, Logout, ErrorHandler);

  return router;
};


export default {
  CreateRouter,
};
