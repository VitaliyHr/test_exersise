import { SaveBookChanges } from '../servises/books.servise';

export default async function BookCounter(req, res, next, book) {
  book.count += 1;
  if (book.count === 2) {
    book.score = 5;
  } else if (book.count === 5) {
    book.score = 10;
  } else if (book.count === 7) {
    book.score = 15;
  }
  await SaveBookChanges(book);
}
