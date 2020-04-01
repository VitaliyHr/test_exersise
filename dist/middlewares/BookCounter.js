"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BookCounter = BookCounter;
async function BookCounter(req, res, next, book) {
  ++book.count;
  if (book.count === 2) {
    book.score = 5;
  } else if (book.count === 5) {
    book.score = 10;
  } else if (book.count === 7) {
    book.score = 15;
  }
  await book.save();
}