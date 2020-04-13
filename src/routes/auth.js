import { Router } from 'express';
import auth from '../middlewares/auth';
import {
  loginController, registerController, resetController, getReset, SetPass, Logout,
} from '../controllers/auth.controller';
import checkValidator from '../servises/validation.servise';
import { loginvalidator, registervalidator, ParamsValidator } from '../middlewares/validator';


const router = Router();


router.post('/login', loginvalidator, checkValidator, loginController);

router.post('/register', registervalidator, checkValidator, registerController);

// скинути пароль
router.post('/reset/:id', auth, ParamsValidator, checkValidator, resetController);

// url для відновлення
router.get('/reset/:token', auth, getReset);

// ввод нового паролю
router.put('/password', auth, SetPass);

// вийти з аккаунта
router.get('/logout', auth, Logout);


export default router;
