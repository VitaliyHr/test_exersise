const { Router } = require('express');
const { validationResult, body } = require('express-validator');
const Books = require('../models/books');
const auth = require('../middlewares/auth');
const User = require('../models/user');
const { addBookVal, patchbook, SetOwn } = require('../middlewares/validator');
const Ctrl = require('../controllers/books.controller')
const {check_validator} = require('../servises/validation.servise')


const router = Router();

//книги для незареєстрованих користувачів
router.get('/',Ctrl.getBooksForUnlogined);

router.post('/logined_user', auth, Ctrl.getBooksForLogined);

//додати книгу
router.post('/add', auth, addBookVal, check_validator, Ctrl.AddBook)

//додати книгу в бібліотеку користувача
router.post('/setOwn/:id', auth, Ctrl.SetOwn);

//видати всі книги з бібліотеки користувача
router.post('/getOwn', auth, Ctrl.GetOwn);

//інформація про книгу
router.get('/:id/info', auth, Ctrl.BookInfo);

//змінити книгу
router.patch('/:id/edit', patchbook,check_validator, auth, Ctrl.EditBook)

//видалити книгу
router.delete('/:id/delete', auth, Ctrl.DeleteBook);


module.exports = router;
