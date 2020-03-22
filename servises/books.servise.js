const Books = require('../models/books');

exports.GetBooks = async () => {
  return await Books.find();
};

exports.AddBook = async (title, author, isFinished, notes, userId) => {
  const book = new Books({ title, author, isFinished, notes, userId });
  return await book.save();
};

exports.FindBookByID = async (id) => {
  return await Books.findById(id);
};

exports.FindAndDelete = async (id) => {
  await Books.findByIdAndDelete(id);
  return true;
};
