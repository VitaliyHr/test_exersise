const { Router } = require('express');
const auth = require('../middlewares/auth');
const Ctrl = require('../controllers/auth.controller');
const { check_validator } = require('../servises/validation.servise');
const { loginvalidator, registervalidator } = require('../middlewares/validator');


const router = Router();


router.post('/login', loginvalidator, check_validator, Ctrl.login_controller);

router.post('/register', registervalidator, check_validator, Ctrl.register_controller);

//скинути пароль
router.post('/reset:id', auth, Ctrl.reset_controller);

//url для відновлення
router.get('/reset/:token', auth, Ctrl.getReset);

//ввод нового паролю
router.put('/password', auth, Ctrl.SetPass);

//вийти з аккаунта
router.get('/logout', auth, Ctrl.Logout);


module.exports = router;
