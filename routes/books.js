const { Router } = require('express');
const auth = require('../middlewares/auth');
const { addBookVal, patchbook, ParamsValidator } = require('../middlewares/validator');
const Ctrl = require('../controllers/books.controller');
const { check_validator } = require('../servises/validation.servise');


const router = Router();

//книги для незареєстрованих користувачів
router.get('/', Ctrl.getBooksForUnlogined);

router.post('/logined_user', auth, Ctrl.getBooksForLogined);

//додати книгу
router.post('/add', auth, addBookVal, check_validator, Ctrl.AddBook);

//додати книгу в бібліотеку користувача
router.post('/setOwn/:id', auth, ParamsValidator, check_validator, Ctrl.SetOwn);

//видати всі книги з бібліотеки користувача
router.post('/getOwn', auth, Ctrl.GetOwn);

//інформація про книгу
router.get('/:id/info', auth, ParamsValidator, check_validator, Ctrl.BookInfo);

//змінити книгу
router.patch('/:id/edit', auth,ParamsValidator, patchbook, check_validator, Ctrl.EditBook);

//видалити книгу
router.delete('/:id/delete', auth, ParamsValidator, check_validator, Ctrl.DeleteBook);


module.exports = router;
