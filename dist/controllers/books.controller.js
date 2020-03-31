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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

async function getBooksForUnlogined(req, res, next) {
  var allbooks = await (0, _books2.GetBooks)();
  var books = allbooks.filter(function (book) {
    return book.score >= 2;
  });
  res.status(200).json({ success: true, books: books });
  return next();
}

async function getBooksForLogined(req, res, next) {
  var books = await (0, _books2.GetBooks)();
  res.status(200).json({ success: true, books: books });
  return next();
}

async function AddBooks(req, res, next) {
  var _req$body = req.body,
      title = _req$body.title,
      author = _req$body.author,
      isFinished = _req$body.isFinished,
      notes = _req$body.notes;

  var book = await (0, _books2.AddBook)(title, author, isFinished, notes, req.session.user._id);
  res.status(200).json({ success: true, book: book });
  return next();
}

async function SetOwn(req, res, next) {
  var book = await (0, _books2.FindBookByID)(req.params.id);

  if (!book) {
    res.status(400).json({ success: false, error: { name: "Database error", message: "No such book" } });
    return next();
  }
  var user = await (0, _user.FindUserById)(req.session.user._id);
  user.books.push(book.id);
  ++book.count;
  if (book.count === 2) {
    book.score = 5;
  } else if (book.count === 5) {
    book.score = 10;
  } else if (book.count === 7) {
    book.score = 15;
  }
  await book.save();
  await user.save();
  res.status(201).json({ success: true, user: user });
  return next();
}

async function GetOwn(req, res, next) {
  var user = await (await (0, _user.FindUserById)(req.session.user._id)).populate('books._id').execPopulate();

  if (req.body.filterBy) {
    var filterBy = req.body.filterBy;


    if (filterBy == 'author') {
      var books = user.books.map(function (b) {
        return b._id.author === req.body.author ? b._id : undefined;
      });
      res.status(200).json({ success: true, books: books });
      return next();
    }

    if (filterBy == 'isFinished') {
      var _books = user.books.map(function (b) {
        return b._id.isFinished == JSON.parse(req.body.isFinished) ? b._id : undefined;
      });
      res.status(200).json({ success: true, books: _books });
      return next();
    }
  }
  res.status(200).json({ success: true, books: user.books });
  return next();
}

async function BookInfo(req, res, next) {
  var book = await (0, _books2.FindBookByID)(req.params.id);
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

  var book = await (0, _books2.FindBookByID)(req.params.id);
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
  var book = {};
  try {
    book = await (0, _books2.FindBookByID)(req.params.id);
  } catch (error) {
    res.status(400).json({ error: error });
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
  var user = await (0, _user.FindUserById)(req.session.user._id);
  user.books.filter(function (b) {
    return b._id == book.id ? undefined : b;
  });
  await user.save();
  await (0, _books2.FindAndDelete)(book.id);
  res.status(204).json({ success: true, message: 'book was deleted' });
  return next();
}