/* eslint-disable no-underscore-dangle */
import _ from 'lodash';
import {
  GetBooks, AddBook, FindBookByID, FindAndDelete, SaveBookChanges, GetBooksByUserList,
} from '../servises/books';
import { FindUserById, SaveUserChanges } from '../servises/user';
import BookCounter from '../middlewares/bookcounter';
import log4js from '../middlewares/loggerconfig';

const logger = log4js.getLogger('debug');


export async function getBooks(req, res, next) {
  let allbooks;

  try {
    allbooks = await GetBooks();
  } catch (err) {
    const error = 'Failed to get books';
    res.status(500).json({ success: false, error });
    return next(error);
  }

  if (req.session.isAuthenticated) {
    res.status(200).json({ success: true, books: allbooks });
    return next();
    // eslint-disable-next-line no-else-return
  } else {
    const books = _.filter(allbooks, (b) => b.score >= 2);
    res.status(200).json({ success: true, books });
    return next();
  }
}


export async function AddBooks(req, res, next) {
  let book;

  try {
    book = await AddBook(req.body, req.session.user._id);
  } catch (err) {
    const error = `Failed to add book ${err}`;
    res.status(500).json({ success: false, error });
    return next(error);
  }

  if (!book) {
    const error = `Failed to create book by user ${req.session.user._id}`;
    res.status(400).json({ success: false, error });
    return next(error);
  }

  res.status(201).json({ success: true, book });
  logger.info(`Added new book ${book.id}`);
  return next();
}


export async function Own(req, res, next) {
  let user;

  try {
    user = await FindUserById(req.session.user._id);
  } catch (err) {
    const error = `Failed to find user by userId ${req.session.user._id}`;
    res.status(500).json({ success: false, error });
    return next(error);
  }

  if (!user) {
    const error = 'user not found';
    res.status(404).json({ success: false, error });
    return next();
  }

  if (req.body.id) {
    let book;

    try {
      book = await FindBookByID(req.body.id);
    } catch (err) {
      const error = `Failed to find book by bookId ${req.body.id}`;
      res.status(500).json({ success: false, error });
      return next(error);
    }

    if (!book) {
      const error = 'Book not found';
      res.status(404).json({ success: false, error });
      return next(error);
    }

    user.books.push(book.id);

    try {
      await SaveUserChanges(user);
    } catch (err) {
      const error = 'Failed to save changes';
      res.status(500).json({ success: false, error });
      return next(error);
    }

    try {
      await BookCounter(book);
    } catch (err) {
      const error = 'Failed to save books changes';
      res.status(500).json({ success: false, error });
      return next(error);
    }

    res.status(201).json({ success: true, user });
    return next();
    // eslint-disable-next-line no-else-return
  } else {
    let Isfinished;
    let books;
    const { filterBy } = req.body;

    if (!user.books) {
      const error = 'User\'s list of books is empty';
      res.status(200).json({ success: false, error });
      return next();
    }

    try {
      books = await GetBooksByUserList(user.books);
    } catch (err) {
      const error = 'Failed to extend users book';
      res.status(500).json({ success: false, error });
      return next(error);
    }

    if (req.body.filterBy) {
      if (filterBy === 'author') {
        books = _.filter(books, (b) => b.author === req.body.author);
        res.status(200).json({ success: true, books });
        return next();
      }

      if (filterBy === 'isfinished') {
        try {
          Isfinished = JSON.parse(req.body.isfinished);
        } catch (err) {
          const error = `Failed to parse JSON at body.isfinished by user ${user.id}`;
          res.status(500).json({ success: false, error });
          return next(error);
        }

        books = _.filter(books, (b) => b.isfinished === Isfinished);
        res.status(200).json({ success: true, books });
        return next();
      }
    }
    res.status(200).json({ success: true, books: user.books });
    return next();
  }
}

export async function BookInfo(req, res, next) {
  let book;
  try {
    book = await FindBookByID(req.params.id);
  } catch (err) {
    const error = `Failed to find book by bookId ${req.params.id}`;
    res.status(500).json({ success: false, error });
    return next(error);
  }

  if (!book) {
    const error = `Book ${req.params.id} not found`;
    res.status(404).json({ success: false, error });
    return next(error);
  }
  res.status(200).json({ success: true, book });
  return next();
}


export async function EditBook(req, res, next) {
  const { user } = await req.session;
  const {
    title, author, isfinished, notes, userid,
  } = req.body;
  let book;

  if (user._id.toString() !== userid) {
    const error = 'User is not exist';
    res.status(400).json({ success: false, error });
    return next(error);
  }
  try {
    book = await FindBookByID(req.params.id);
  } catch (err) {
    const error = `Failed to find book by bookId ${req.params.id}`;
    res.status(500).json({ success: false, error });
    return next(error);
  }

  if (!book) {
    const error = `Book ${req.params.id} not found`;
    res.status(404).json({ success: false, error });
    return next(error);
  }

  if (book.userid !== JSON.stringify(user._id)) {
    const error = 'Access error';
    res.status(400).json({ success: false, error });
    return next(error);
  }
  Object.assign(book, {
    title, author, isfinished, notes,
  });

  try {
    await SaveBookChanges(book);
  } catch (err) {
    const error = `Failed to save changes in book ${book.id}`;
    res.status(500).json({ success: false, error });
    return next(error);
  }
  res.status(200).json({ success: true, book });
  logger.info(`Book ${book.id} was updated`);
  return next();
}


export async function DeleteBook(req, res, next) {
  let book;
  let user;

  try {
    book = await FindBookByID(req.params.id);
  } catch (err) {
    const error = `Failed to find book by bookId ${req.params.id}`;
    res.status(500).json({ success: false, error });
    return next(error);
  }

  if (!book) {
    const error = `Book ${req.params.id} not found`;
    res.status(404).json({ success: false, error });
    return next(error);
  }

  if (book.userid !== JSON.stringify(req.session.user._id)) {
    const error = 'Access error';
    res.status(400).json({ success: false, error });
    return next(error);
  }

  try {
    user = await FindUserById(req.session.user._id);
  } catch (err) {
    const error = `Failed to find user by userId ${req.session.user._id}`;
    res.status(500).json({ success: false, error });
    return next(error);
  }
  if (!user) {
    const error = `User ${req.session.user._id} not found`;
    res.status(404).json({ success: false, error });
    return next(error);
  }

  user.books = await _.filter(user.books, (b) => b.id === book.id);

  try {
    await SaveUserChanges(user);
  } catch (err) {
    const error = `Failed to save changes in user ${user.id}`;
    res.status(500).json({ success: false, error });
    return next(error);
  }

  try {
    await FindAndDelete(book.id);
  } catch (err) {
    const error = `Failed to delete book by bookId ${book.id}`;
    res.status(500).json({ success: false, error });
    return next(error);
  }

  res.status(205).json({ success: true, message: 'book was deleted' });
  logger.info(`Book ${book.id} was deleted`);
  return next();
}
