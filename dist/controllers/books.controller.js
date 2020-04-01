'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBooksForUnlogined = getBooksForUnlogined;
exports.getBooksForLogined = getBooksForLogined;
exports.AddBooks = AddBooks;
exports.SetOwn = SetOwn;
exports.GetOwn = GetOwn;
exports.BookInfo = BookInfo;
exports.EditBook = EditBook;
exports.DeleteBook = DeleteBook;

var _books2 = require('../servises/books.servise');

var _user = require('../servises/user.servise');

var _BookCounter = require('../middlewares/BookCounter');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

async function getBooksForUnlogined(req, res, next) {
  var allbooks = void 0;
  try {
    allbooks = await (0, _books2.GetBooks)();
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: { name: "Critical error", message: "Failed while finding books", errorSthamp: err } });
    return next();
  }

  var books = _lodash2.default.filter(allbooks, function (b) {
    return b.score >= 2;
  });
  res.status(200).json({ success: true, books: books });
  return next();
}

async function getBooksForLogined(req, res, next) {
  var books = void 0;
  try {
    books = await (0, _books2.GetBooks)();
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: { name: "Citical error", message: "Failed while getting books", errorSthamp: err } });
    return next();
  }

  res.status(200).json({ success: true, books: books });
  return next();
}

async function AddBooks(req, res, next) {
  var _req$body = req.body,
      title = _req$body.title,
      author = _req$body.author,
      isFinished = _req$body.isFinished,
      notes = _req$body.notes;

  var book = void 0;
  try {
    book = await (0, _books2.AddBook)(title, author, isFinished, notes, req.session.user._id);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: { name: "Critical error", message: "Failed while adding book", errorSthamp: err } });
    return next();
  }
  res.status(200).json({ success: true, book: book });
  return next();
}

async function SetOwn(req, res, next) {
  var book = void 0,
      user = void 0;
  try {
    book = await (0, _books2.FindBookByID)(req.params.id);
    user = await (0, _user.FindUserById)(req.session.user._id);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: { name: "Critical error", message: "Failed while finding user or book", errorSthamp: err } });
    return next();
  }

  if (!book) {
    res.status(400).json({ success: false, error: { name: "Database error", message: "No such book" } });
    return next();
  }
  if (!user) {
    res.status(400).json({ success: false, error: { name: "Database error", message: "No such user" } });
    return next();
  }
  user.books.push(book.id);

  await (0, _BookCounter.BookCounter)(req, res, next, book);

  await user.save();
  res.status(201).json({ success: true, user: user });
  return next();
}

async function GetOwn(req, res, next) {
  var user = void 0;
  try {
    user = await (await (0, _user.FindUserById)(req.session.user._id)).populate('books._id').execPopulate();
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: { name: "Citical error", message: "Failed while finding user", errorSthamp: err } });
    return next();
  }

  if (req.body.filterBy) {
    var filterBy = req.body.filterBy;


    if (filterBy == 'author') {
      var books = _lodash2.default.filter(user.books, function (b) {
        return b._id.author == req.body.author;
      });
      res.status(200).json({ success: true, books: books });
      return next();
    }

    if (filterBy == 'isFinished') {
      var _books = _lodash2.default.filter(user.books, function (b) {
        return b._id.isFinished === JSON.parse(req.body.isFinished);
      });
      res.status(200).json({ success: true, books: _books });
      return next();
    }
  }
  res.status(200).json({ success: true, books: user.books });
  return next();
}

async function BookInfo(req, res, next) {
  var book = void 0;
  try {
    book = await (0, _books2.FindBookByID)(req.params.id);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: { name: "Cititcal error", message: "Failed while finding book", errorSthamp: err } });
    return next();
  }

  if (!book) {
    res.status(404).json({ success: false, error: { name: "Datatbase error", message: "cannot find such book" } });
    return next();
  }
  res.status(200).json({ success: true, book: book });
  return next();
}

async function EditBook(req, res, next) {
  var _ref = await req.session,
      user = _ref.user;

  var book = void 0;
  try {
    book = await (0, _books2.FindBookByID)(req.params.id);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: { name: "Critical error", message: "Failed while finding book", errorSthamp: err } });
    return next();
  }
  if (!book) {
    res.status(404).json({ success: false, error: _defineProperty({ name: "Database error" }, 'name', "invalid book") });
    return next();
  }

  if (book.userId.toString() != user._id) {
    res.status(400).json({ success: false, error: { name: 'Unequal error', message: 'can\'t redact becouse of root' } });
    return next();
  }
  Object.assign(book, req.body);
  await book.save();
  res.status(200).json({ success: true, book: book });
  return next();
}

async function DeleteBook(req, res, next) {
  var book = void 0;
  try {
    book = await (0, _books2.FindBookByID)(req.params.id);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: { name: "Critical error", message: "Failed while finding book", errorSthamp: err } });
    return next();
  }

  if (!book) {
    res.status(404).json({ success: false, error: { name: "Database error", message: "No such book" } });
    return next();
  }

  if (book.userId.toString() != req.session.user._id.toString()) {
    res.status(400).json({ success: false, error: { name: "Access error", message: "you can\'t delete becouse of root" } });
    return next();
  }
  try {
    var user = await (0, _user.FindUserById)(req.session.user._id);
    user.books.filter(function (b) {
      return b._id == book.id ? undefined : b;
    });
    await user.save();
    await (0, _books2.FindAndDelete)(book.id);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: { name: "Critical error", message: "Failed while finding user or deleting book", errorSthamp: err } });
    return next();
  }
  res.status(204).json({ success: true, message: 'book was deleted' });
  return next();
}