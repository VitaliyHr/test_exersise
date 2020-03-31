'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _auth = require('../middlewares/auth');

var _auth2 = _interopRequireDefault(_auth);

var _auth3 = require('../controllers/auth.controller');

var _validation = require('../servises/validation.servise');

var _validator = require('../middlewares/validator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express.Router)();

router.post('/login', _validator.loginvalidator, _validation.check_validator, _auth3.login_controller);

router.post('/register', _validator.registervalidator, _validation.check_validator, _auth3.register_controller);

//скинути пароль
router.post('/reset/:id', _auth2.default, _validator.ParamsValidator, _validation.check_validator, _auth3.reset_controller);

//url для відновлення
router.get('/reset/:token', _auth2.default, _auth3.getReset);

//ввод нового паролю
router.put('/password', _auth2.default, _auth3.SetPass);

//вийти з аккаунта
router.get('/logout', _auth2.default, _auth3.Logout);

exports.default = router;