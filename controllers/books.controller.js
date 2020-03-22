const book_servise = require('../servises/books.servise');
const user_service = require('../servises/user.servise');

exports.getBooksForUnlogined = async (req, res, next) => {
  const allbooks = await book_servise.GetBooks();
  const books = allbooks.filter((book) => book.score >= 2);
  res.status(200).json(books);
  return next();
};

exports.getBooksForLogined = async (req, res, next) => {
  const books = await book_servise.GetBooks();
  res.status(200).json(books);
  return next();
};

exports.AddBook = async (req, res, next) => {
  const { title, author, isFinished, notes } = req.body;
  const book = await book_servise.AddBook(title, author, isFinished, notes, req.session.user._id);
  res.status(200).json(book);
  return next();
};

exports.SetOwn = async (req, res, next) => {
  const book = await book_servise.FindBookByID(req.params.id);
  if (!book) {
    res.status(400).json('No such book');
    return next();
  }
  const user = await user_service.FindUserById(req.session.user._id);
  user.books.push(book.id);
  ++book.count;
  if (book.count == 2) {
    book.score = 5;
  } else if (book.count == 5) {
    book.score = 10;
  } else if (book.count == 7) {
    book.score = 15;
  }
  await book.save();
  await user.save();
  res.status(200).json(user);
  return next();
};

exports.GetOwn = async (req, res, next) => {
  const user = await (await user_service.FindUserById(req.session.user._id)).populate('books._id').execPopulate();

  if (req.body.filterBy) {
    const { filterBy } = req.body;
    if (filterBy == 'author') {
      const books = user.books.map((b) =>b._id.author=== req.body.author?b._id:undefined);
      res.status(200).json(books);
      return next();
    }

    if (filterBy == 'isFinished') {
      const books = user.books.map((b) => b._id.isFinished == JSON.parse(req.body.isFinished)?b._id:undefined);
      res.status(200).json(books);
      return next();
    }
  }
  res.status(200).json(user.books);
  return next();
};

exports.BookInfo = async (req, res, next) => {
  const book = await book_servise.FindBookByID(req.params.id);
  if (!book) {
    res.status(400).json('cannot find such book');
    return next();
  }
  res.status(200).json(book);
  return next();
};

exports.EditBook = async (req, res, next) => {
  const { user } = await req.session;
  const book = await book_servise.FindBookByID(req.params.id);
  if (!book) {
    res.status(400).json('invalid book');
    return next();
  }

  if (book.userId.toString() != user._id) {
    res.status(400).json({ error: 'true', message: 'can\'t redact becouse of root' });
    return next();
  }
  Object.assign(book, req.body);
  await book.save();
  res.status(200).json(book);
  return next();
};

exports.DeleteBook = async (req, res, next) => {
  const book = await book_servise.FindBookByID(req.params.id);
  if (!book) {
    res.status(400).json('No such book');
    return next();
  }

  if (book.userId.toString()!= req.session.user._id.toString()) {
    res.status(400).json('you can\'t delete becouse of root');
    return next();
  }
  const user = await user_service.FindUserById(req.session.user._id);
  user.books.filter(b=>b._id==book.id?undefined:b);
  await user.save();
  await book_servise.FindAndDelete(book.id);
  res.status(204).json('book was deleted');
  return next();
};
