import Books from '../models/books';


export async function GetBooks() {
  let books;

  try {
    books = await Books.find();
  } catch (err) {
    const error = 'Failed to adress to database';
    throw new Error(error);
  }

  return books;
}

export async function SaveBookChanges(book) {
  try {
    await book.save();
  } catch (err) {
    const error = 'Failed to save changes.';
    throw new Error(error);
  }
}

export async function AddBook({ title, author, isFinished, notes }, userId) {
  const CreatedAt = new Date();
  const book = new Books({
    title, author, isFinished, notes, userId, CreatedAt,
  });
  try {
    await book.save();
  } catch (err) {
    const error = 'Failed to save changes';
    throw new Error(error);
  }
  return book;
}

export async function FindBookByID(id) {
  let books;

  try {
    books = await Books.findById(id);
  } catch (err) {
    const error = 'Failed to find element by bookId';
    throw new Error(error);
  }

  return books;
}

export async function FindAndDelete(id) {
  try {
    await Books.findByIdAndDelete(id);
  } catch (err) {
    const error = 'Failed to delete book';
    throw new Error(error);
  }
}
