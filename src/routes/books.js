import { Router } from 'express';
import auth from '../middlewares/auth';
import { addBookVal, patchbook, ParamsValidator } from '../middlewares/validator';
import {
  getBooksForUnlogined,
  getBooksForLogined,
  AddBooks,
  SetOwn,
  GetOwn,
  BookInfo,
  EditBook,
  DeleteBook,
} from '../controllers/books.controller';
import checkValidator from '../servises/validation.servise';
import ErrorHandler from '../middlewares/error.handler';


const router = Router();

// книги для незареєстрованих користувачів
router.get('/', getBooksForUnlogined, ErrorHandler);

// книги для зареєстрованих користувачів
router.get('/logined_user', auth, getBooksForLogined, ErrorHandler);

// додати книгу
router.put('/add', auth, addBookVal, checkValidator, AddBooks, ErrorHandler);

// додати книгу в бібліотеку користувача
router.post('/setOwn/:id', auth, ParamsValidator, checkValidator, SetOwn, ErrorHandler);

// видати всі книги з бібліотеки користувача
router.post('/getOwn', auth, GetOwn, ErrorHandler);

// інформація про книгу
router.get('/:id/info', auth, ParamsValidator, checkValidator, BookInfo, ErrorHandler);

// змінити книгу
router.patch('/:id/edit', auth, ParamsValidator, patchbook, checkValidator, EditBook, ErrorHandler);

// видалити книгу
router.delete('/:id/delete', auth, ParamsValidator, checkValidator, DeleteBook, ErrorHandler);


export default router;
