/* eslint-disable no-underscore-dangle */
import _ from 'lodash';
import {
  GetBooks, AddBook, FindBookByID, FindAndDelete, SaveBookChanges,
} from '../servises/books.servise';
import { FindUserById, SaveUserChanges } from '../servises/user.servise';
import BookCounter from '../middlewares/BookCounter';


export async function getBooksForUnlogined(req, res, next) {
  let allbooks;

  try {
    allbooks = await GetBooks();
  } catch (err) {
    console.log(err);
    const error = `Failed to get books. Source:${err}`;
    res.status(500).send(error);
    return next();
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
    console.log(err);
    const error = `Failed to get books. Source:${err}`;
    res.status(500).send(error);
    return next();
  }

  res.status(200).json({ success: true, books });
  return next();
}


export async function AddBooks(req, res, next) {
  const {
    title, author, isFinished, notes,
  } = req.body;
  let book;

  try {
    book = await AddBook(title, author, isFinished, notes, req.session.user._id);
  } catch (err) {
    console.log(err);
    const error = `Failed to add book. Source:${err}`;
    res.status(500).send(error);
    return next();
  }

  if (!book) {
    res.status(400).send('Book was not created');
    return next();
  }
  try {
    await SaveBookChanges(book);
  } catch (err) {
    console.log(err);
    const error = `Failed to save book changes. Source:${err}`;
    res.status(500).send(error);
    return next();
  }

  res.status(200).json({ success: true, book });
  return next();
}


export async function SetOwn(req, res, next) {
  let book;
  let user;

  try {
    user = await FindUserById(req.session.user._id);
  } catch (err) {
    console.log(err);
    const error = `Failed to find user by userId ${req.session.user._id}.Source:${err}`;
    res.status(500).send(error);
    return next();
  }

  if (!user) {
    res.status(404).send('user not found');
    return next();
  }

  try {
    book = await FindBookByID(req.params.id);
  } catch (err) {
    console.log(err);
    const error = `Failed to find book by bookId ${req.params.id}.Source:${err}`;
    res.status(500).send(error);
    return next();
  }

  if (!book) {
    res.status(404).send('Book not found');
    return next();
  }

  user.books.push(book.id);

  try {
    await SaveUserChanges(user);
  } catch (err) {
    console.log(err);
    const error = `Failed to save changes. Source:${err}`;
    res.status(500).send(error);
    return next();
  }

  try {
    await BookCounter(req, res, next, book);
  } catch (err) {
    console.log(err);
    const error = `Failed to save books changes. Source:${err}`;
    res.status(500).send(error);
    return next();
  }

  res.status(201).json({ success: true, user });
  return next();
}


export async function GetOwn(req, res, next) {
  let user;
  try {
    user = await (await FindUserById(req.session.user._id)).populate('books._id').execPopulate();
  } catch (err) {
    console.log(err);
    const error = `Failed to find user by userId${req.session.user._id}. Source:${err}`;
    res.status(500).send(error);
    return next();
  }

  if (req.body.filterBy) {
    const { filterBy } = req.body;

    if (filterBy === 'author') {
      const books = _.filter(user.books, (b) => b._id.author === req.body.author);
      res.status(200).json({ success: true, books });
      return next();
    }

    if (filterBy === 'isFinished') {
      const books = _.filter(user.books, (b) => b._id.isFinished === JSON.parse(req.body.isFinished));
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
    console.log(err);
    const error = `Failed to find book by bookId ${req.params.id}. Source:${err}`;
    res.status(500).send(error);
    return next();
  }

  if (!book) {
    res.status(404).send('book not found');
    return next();
  }
  res.status(200).json({ success: true, book });
  return next();
}


export async function EditBook(req, res, next) {
  const { user } = await req.session;
  let book;

  try {
    book = await FindBookByID(req.params.id);
  } catch (err) {
    console.log(err);
    const error = `Failed to find book by bookId ${req.params.id}. Source:${err}`;
    res.status(500).send(error);
    return next();
  }
  if (!book) {
    res.status(404).send('book not found');
    return next();
  }

  if (book.userId.toString() !== user._id.toString()) {
    res.status(400).json({ success: false, error: { message: 'can\'t redact becouse of root' } });
    return next();
  }
  Object.assign(book, req.body);
  try {
    await SaveBookChanges(book);
  } catch (err) {
    console.log(err);
    const error = `Failed to save changes in book ${book.id}. Source:${err}`;
    res.status(500).send(error);
    return next();
  }
  res.status(200).json({ success: true, book });
  return next();
}


export async function DeleteBook(req, res, next) {
  let book;
  let user;
  let result;

  try {
    book = await FindBookByID(req.params.id);
  } catch (err) {
    console.log(err);
    const error = `Failed to find book by bookId ${req.params.id}. Source:${err}`;
    res.status(500).send(error);
    return next();
  }

  if (!book) {
    res.status(404).send('book not found');
    return next();
  }

  if (book.userId.toString() !== req.session.user._id.toString()) {
    res.status(400).send('you can\'t delete becouse of root');
    return next();
  }

  try {
    user = await FindUserById(req.session.user._id);
  } catch (err) {
    console.log(err);
    const error = `Failed to find user by userId ${req.session.user._id}. Source:${err}`;
    res.status(500).send(error);
    return next();
  }
  user.books = await _.filter(user.books, (b) => b._id === book.id);

  try {
    await SaveUserChanges(user);
  } catch (err) {
    console.log(err);
    const error = `Failed to save changes in user ${user.id}. Source:${err}`;
    res.status(500).send(error);
    return next();
  }

  try {
    result = await FindAndDelete(book.id);
  } catch (err) {
    console.log(err);
    const error = `Failed to delete book by bookId ${book.id}. Source:${err}`;
    res.status(500).send(error);
    return next();
  }
  if (!result) {
    res.status(400).send('Book was not deleted from database');
    return next();
  }

  res.status(204).json({ success: true, message: 'book was deleted' });
  return next();
}
