'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetBooks = GetBooks;
exports.AddBook = AddBook;
exports.FindBookByID = FindBookByID;
exports.FindAndDelete = FindAndDelete;

var _books = require('../models/books');

var _books2 = _interopRequireDefault(_books);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function GetBooks() {
  return await _books2.default.find();
}

async function AddBook(title, author, isFinished, notes, userId) {
  var book = new _books2.default({ title: title, author: author, isFinished: isFinished, notes: notes, userId: userId });
  return await book.save();
}

async function FindBookByID(id) {
  return await _books2.default.findById(id);
}

async function FindAndDelete(id) {
  await _books2.default.findByIdAndDelete(id);
  return true;
}