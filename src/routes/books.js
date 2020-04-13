import { Router } from 'express';
import auth from '../middlewares/auth';
import { addBookVal, patchbook, ParamsValidator } from '../middlewares/validator';
import {
  getBooksForUnlogined, getBooksForLogined,
  AddBooks, SetOwn, GetOwn, BookInfo, EditBook, DeleteBook,
} from '../controllers/books.controller';
import checkValidator from '../servises/validation.servise';


const router = Router();

// книги для незареєстрованих користувачів
router.get('/', getBooksForUnlogined);

router.post('/logined_user', auth, getBooksForLogined);

// додати книгу
router.post('/add', auth, addBookVal, checkValidator, AddBooks);

// додати книгу в бібліотеку користувача
router.post('/setOwn/:id', auth, ParamsValidator, checkValidator, SetOwn);

// видати всі книги з бібліотеки користувача
router.post('/getOwn', auth, GetOwn);

// інформація про книгу
router.get('/:id/info', auth, ParamsValidator, checkValidator, BookInfo);

// змінити книгу
router.patch('/:id/edit', auth, ParamsValidator, patchbook, checkValidator, EditBook);

// видалити книгу
router.delete('/:id/delete', auth, ParamsValidator, checkValidator, DeleteBook);


export default router;
