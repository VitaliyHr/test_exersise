import { Router } from 'express';
import auth from '../middlewares/auth';
import { addBookVal, patchbook, ParamsValidator } from '../middlewares/validator';
import {
  getBooks,
  AddBooks,
  Own,
  BookInfo,
  EditBook,
  DeleteBook,
} from '../controllers/books';
import checkValidator from '../servises/validation';
import ErrorHandler from '../middlewares/error';


const CreateRouter = () => {
  const router = Router();

  // книги для користувачів
  router.get('/', getBooks, ErrorHandler);

  // додати книгу
  router.put('/newbook', auth, addBookVal, checkValidator, AddBooks, ErrorHandler);

  // книги користувача
  router.post('/own', auth, Own, ErrorHandler);

  // інформація про книгу
  router.get('/:id/info', auth, ParamsValidator, checkValidator, BookInfo, ErrorHandler);

  // змінити книгу
  router.patch('/:id/edit', auth, ParamsValidator, patchbook, checkValidator, EditBook, ErrorHandler);

  // видалити книгу
  router.delete('/:id', auth, ParamsValidator, checkValidator, DeleteBook, ErrorHandler);

  return router;
};


export default {
  CreateRouter,
};
