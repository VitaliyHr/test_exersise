import { Router } from 'express';
import auth from '../middlewares/auth';
import { login_controller, register_controller, reset_controller, getReset, SetPass, Logout } from '../controllers/auth.controller';
import { check_validator } from '../servises/validation.servise';
import { loginvalidator, registervalidator, ParamsValidator } from '../middlewares/validator';


const router = Router();


router.post('/login', loginvalidator, check_validator, login_controller);

router.post('/register', registervalidator, check_validator, register_controller);

//скинути пароль
router.post('/reset/:id', auth, ParamsValidator, check_validator, reset_controller);

//url для відновлення
router.get('/reset/:token', auth, getReset);

//ввод нового паролю
router.put('/password', auth, SetPass);

//вийти з аккаунта
router.get('/logout', auth, Logout);


export default router;
