import Books from '../models/books';

export async function GetBooks() {
  let books;

  try {
    books = await Books.find();
  } catch (err) {
    console.log(err);
    const error = `Failed to adress to database. Error:${err}`;
    throw new Error(error);
  }

  return books;
}

export async function SaveBookChanges(book) {
  if (!book) {
    throw new Error('Function was called without params');
  }
  try {
    await book.save();
  } catch (err) {
    console.log(err);
    const error = `Failed to save changes. Error${err}`;
    throw new Error(error);
  }
}

export async function AddBook(title, author, isFinished, notes, userId) {
  const book = new Books({
    title, author, isFinished, notes, userId,
  });

  return book;
}

export async function FindBookByID(id) {
  let books;

  try {
    books = await Books.findById(id);
  } catch (err) {
    console.log(err);
    const error = `Failed to find element by bookId. Error:${err}`;
    throw new Error(error);
  }

  return books;
}

export async function FindAndDelete(id) {
  try {
    await Books.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    const error = `Failed to delete book. Error:${err}`;
    throw new Error(error);
  }
  return true;
}
