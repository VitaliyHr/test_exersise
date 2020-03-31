import { Router } from 'express';
import auth from '../middlewares/auth';
import { addBookVal, patchbook, ParamsValidator } from '../middlewares/validator';
import { getBooksForUnlogined, getBooksForLogined, AddBooks, SetOwn, GetOwn, BookInfo, EditBook, DeleteBook } from '../controllers/books.controller';
import { check_validator } from '../servises/validation.servise';


const router = Router();

//книги для незареєстрованих користувачів
router.get('/', getBooksForUnlogined);

router.post('/logined_user', auth, getBooksForLogined);

//додати книгу
router.post('/add', auth, addBookVal, check_validator, AddBooks);

//додати книгу в бібліотеку користувача
router.post('/setOwn/:id', auth, ParamsValidator, check_validator, SetOwn);

//видати всі книги з бібліотеки користувача
router.post('/getOwn', auth, GetOwn);

//інформація про книгу
router.get('/:id/info', auth, ParamsValidator, check_validator, BookInfo);

//змінити книгу
router.patch('/:id/edit', auth,ParamsValidator, patchbook, check_validator, EditBook);

//видалити книгу
router.delete('/:id/delete', auth, ParamsValidator, check_validator, DeleteBook);


export default router;
