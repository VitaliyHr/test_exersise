'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _auth = require('../middlewares/auth');

var _auth2 = _interopRequireDefault(_auth);

var _validator = require('../middlewares/validator');

var _books = require('../controllers/books.controller');

var _validation = require('../servises/validation.servise');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express.Router)();

//книги для незареєстрованих користувачів
router.get('/', _books.getBooksForUnlogined);

router.post('/logined_user', _auth2.default, _books.getBooksForLogined);

//додати книгу
router.post('/add', _auth2.default, _validator.addBookVal, _validation.check_validator, _books.AddBooks);

//додати книгу в бібліотеку користувача
router.post('/setOwn/:id', _auth2.default, _validator.ParamsValidator, _validation.check_validator, _books.SetOwn);

//видати всі книги з бібліотеки користувача
router.post('/getOwn', _auth2.default, _books.GetOwn);

//інформація про книгу
router.get('/:id/info', _auth2.default, _validator.ParamsValidator, _validation.check_validator, _books.BookInfo);

//змінити книгу
router.patch('/:id/edit', _auth2.default, _validator.ParamsValidator, _validator.patchbook, _validation.check_validator, _books.EditBook);

//видалити книгу
router.delete('/:id/delete', _auth2.default, _validator.ParamsValidator, _validation.check_validator, _books.DeleteBook);

exports.default = router;