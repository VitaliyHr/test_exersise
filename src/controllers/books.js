/* eslint-disable no-underscore-dangle */
import _ from 'lodash';
import {
  GetBooks, AddBook, FindBookByID, FindAndDelete, SaveBookChanges,
} from '../servises/books';
import { FindUserById, SaveUserChanges } from '../servises/user';
import BookCounter from '../middlewares/BookCounter';
import log4js from '../middlewares/loggerConfig';

const logger = log4js.getLogger('debug');


export async function getBooksForUnlogined(req, res, next) {
  let allbooks;

  try {
    allbooks = await GetBooks();
  } catch (err) {
    const error = 'Failed to get books';
    res.status(500).json({ success: false, error });
    return next(new Error(error));
  }

  const books = _.filter(allbooks, (b) => b.score >= 2);
  res.status(200).json({ success: true, books });
  return next();
}


export async function getBooksForLogined(req, res, next) {
  let books;

  try {
    books = await GetBooks();
  } catch (err) {
    const error = 'Failed to get books';
    res.status(500).json({ success: false, error });
    return next(new Error(error));
  }

  res.status(200).json({ success: true, books });
  return next();
}


export async function AddBooks(req, res, next) {
  let book;

  try {
    book = await AddBook(req.body, req.session.user._id);
  } catch (err) {
    const error = `Failed to add book ${err}`;
    res.status(500).json({ success: false, error });
    return next(new Error(error));
  }

  if (!book) {
    const error = `Failed to create book by user ${req.session.user._id}`;
    res.status(400).json({ success: false, error });
    return next(new Error(error));
  }

  res.status(201).json({ success: true, book });
  logger.info(`Added new book ${book.id}`);
  return next();
}


export async function SetOwn(req, res, next) {
  let book;
  let user;

  try {
    user = await FindUserById(req.session.user._id);
  } catch (err) {
    const error = `Failed to find user by userId ${req.session.user._id}`;
    res.status(500).json({ success: false, error });
    return next(new Error(error));
  }

  if (!user) {
    const error = 'user not found';
    res.status(404).json({ success: false, error });
    return next();
  }

  try {
    book = await FindBookByID(req.params.id);
  } catch (err) {
    const error = `Failed to find book by bookId ${req.params.id}`;
    res.status(500).json({ success: false, error });
    return next(new Error(error));
  }

  if (!book) {
    const error = 'Book not found';
    res.status(404).json({ success: false, error });
    return next(new Error(error));
  }

  user.books.push(book.id);

  try {
    await SaveUserChanges(user);
  } catch (err) {
    const error = 'Failed to save changes';
    res.status(500).json({ success: false, error });
    return next(new Error(error));
  }

  try {
    await BookCounter(book);
  } catch (err) {
    const error = 'Failed to save books changes';
    res.status(500).json({ success: false, error });
    return next(new Error(error));
  }

  res.status(201).json({ success: true, user });
  return next();
}


export async function GetOwn(req, res, next) {
  let user;
  let IsFinished;
  let books;
  const { filterBy } = req.body;
  try {
    user = await (await FindUserById(req.session.user._id)).populate('books._id').execPopulate();
  } catch (err) {
    const error = `Failed to find user by userId ${req.session.user._id}`;
    res.status(500).json({ success: false, error });
    return next(new Error(error));
  }

  if (req.body.filterBy) {
    if (filterBy === 'author') {
      books = _.filter(user.books, (b) => b._id.author === req.body.author);
      res.status(200).json({ success: true, books });
      return next();
    }

    if (filterBy === 'isFinished') {
      try {
        IsFinished = JSON.parse(req.body.isFinished);
      } catch (err) {
        const error = `Failed to parse JSON at body.isFinished by user ${user.id}`;
        res.status(500).json({ success: false, error });
        return next(new Error(error));
      }
      books = _.filter(user.books, (b) => b._id.isFinished === IsFinished);
      res.status(200).json({ success: true, books });
      return next();
    }
  }
  res.status(200).json({ success: true, books: user.books });
  return next();
}


export async function BookInfo(req, res, next) {
  let book;
  try {
    book = await FindBookByID(req.params.id);
  } catch (err) {
    const error = `Failed to find book by bookId ${req.params.id}`;
    res.status(500).json({ success: false, error });
    return next(new Error(error));
  }

  if (!book) {
    const error = 'book not found';
    res.status(404).json({ success: false, error });
    return next(new Error(error, req.params.id));
  }
  res.status(200).json({ success: true, book });
  return next();
}


export async function EditBook(req, res, next) {
  const { user } = await req.session;
  const {
    title, author, isFinished, notes, userId,
  } = req.body;
  let book;

  if (user._id.toString() !== userId) {
    const error = 'User is not exist';
    res.status(400).json({ success: false, error });
    return next(new Error(error));
  }
  try {
    book = await FindBookByID(req.params.id);
  } catch (err) {
    const error = `Failed to find book by bookId ${req.params.id}`;
    res.status(500).json({ success: false, error });
    return next(new Error(error));
  }
  if (!book) {
    const error = `Book ${req.params.id} not found`;
    res.status(404).json({ success: false, error });
    return next(new Error(error));
  }

  if (book.userId.toString() !== user._id.toString()) {
    const error = 'Access error';
    res.status(400).json({ success: false, error });
    return next(new Error(error));
  }
  const UpdatedAt = new Date();
  book.UpdatedAt = UpdatedAt;
  Object.assign(book, title, author, isFinished, notes, UpdatedAt);
  try {
    await SaveBookChanges(book);
  } catch (err) {
    const error = `Failed to save changes in book ${book.id}`;
    res.status(500).json({ success: false, error });
    return next(new Error(error));
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
    return next(new Error(error));
  }

  if (!book) {
    const error = 'book not found';
    res.status(404).json({ success: false, error });
    return next(new Error(error));
  }

  if (book.userId.toString() !== req.session.user._id.toString()) {
    const error = 'Access error';
    res.status(400).json({ success: false, error });
    return next(new Error(error));
  }

  try {
    user = await FindUserById(req.session.user._id);
  } catch (err) {
    const error = `Failed to find user by userId ${req.session.user._id}`;
    res.status(500).json({ success: false, error });
    return next(new Error(error));
  }
  if (!user) {
    const error = `User ${req.session.user._id} not found`;
    res.status(404).json({ success: false, error });
    return next(new Error(error));
  }

  user.books = await _.filter(user.books, (b) => b._id === book.id);

  try {
    await SaveUserChanges(user);
  } catch (err) {
    const error = `Failed to save changes in user ${user.id}`;
    res.status(500).json({ success: false, error });
    return next(new Error(error));
  }

  try {
    await FindAndDelete(book.id);
  } catch (err) {
    const error = `Failed to delete book by bookId ${book.id}`;
    res.status(500).json({ success: false, error });
    return next(new Error(error));
  }

  res.status(205).json({ success: true, message: 'book was deleted' });
  logger.info(`Book ${book.id} was deleted`);
  return next();
}
