import Books from '../models/books';

export async function GetBooks() {
  return await Books.find();
}

export async function AddBook(title, author, isFinished, notes, userId) {
  const book = new Books({ title, author, isFinished, notes, userId });
  return await book.save();
}

export async function FindBookByID(id) {
  return await Books.findById(id);
}

export async function FindAndDelete(id) {
  await Books.findByIdAndDelete(id);
  return true;
}
