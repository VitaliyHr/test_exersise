const { Router } = require('express');
const { validationResult, body } = require('express-validator');
const Books = require('../models/books');
const auth = require('../middlewares/auth');
const User = require('../models/user');
const { addBookVal, patchbook } = require('../middlewares/validator');


const router = Router();

//книги для незареєстрованих користувачів
router.get('/', async (req, res) => {
  const allbooks = await Books.find();
  const books = allbooks.filter((b) => b.score >= 2);
  return res.status(200).json(books);
});

router.post('/logined_user', auth, async (req, res) => {
  const books = await Books.find();
  return res.status(200).json(books);
});

//додати книгу
router.post('/add', auth, addBookVal, async (req, res) => {
  try {

    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json(error.array()[0].msg);
    }

    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(400).json('no user');
    }

    const { title, author, isFinished, notes } = req.body;
    const books = new Books({
      title,
      author,
      isFinished,
      notes,
      userId: req.session.user._id,
    });
    await books.save();

    return res.status(201).json(books);
  }
  catch (e) {
    console.log(e);
  }
})

//додати книгу в бібліотеку користувача
router.post('/setOwn/:id', body('userId', 'Set up correct id').isMongoId(), auth, async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array()[0].msg);
    }

    const book = await Books.findById(req.params.id);
    if (!book) {
      return res.status(400).json('no such book');
    }
    
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json('no such user');
    }
    await user.books.push(book.id);
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

  } catch (e) {
    console.log(e);
  }
})

//видати всі книги з бібліотеки користувача
router.post('/getOwn', auth, async (req, res) => {
  try {
    const user = await (await User.findById(req.session.user._id)
      .populate('books._id'))
      .execPopulate();

    if (!user) {
      return res.status(400).json('cant find user');
    }

    if (req.body.filterBy) {
      const { filterBy } = req.body;
      if (filterBy == 'author') {
        const books = user.books.map((b) => { if (b._id.author == req.body.author) { return b } });
        return res.status(200).json(books);
      }

      if (filterBy == 'isFinished') {
        const books = user.books.map((b) => { if (b._id.isFinished.toString() == req.body.isFinished) { return b } });
        return res.status(200).json(books);
      }
    }
    return res.status(200).json(user.books);
  }
  catch (e) {
    console.log(e);
  }
})

//інформація про книгу
router.get('/:id/info', auth, async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Books.findById(id);
    if (!book) {
      return res.status(400).json('not found such book');
    }

    return res.status(200).json((await book).toJSON('utf-8'));
  }
  catch (e) {
    console.log(e);
  }
})

//змінити книгу
router.patch('/:id/edit', patchbook, auth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array()[0].msg);
    }
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json('no such user in db');
    }
    if (!req.session.user) {
      return res.status(400).json('cannot edit course');
    }

    const book = await Books.findById(req.params.id);

    if (!book) {
      return res.status(400).json('No such book');
    }

    if (book.userId != req.session.user._id.toString()) {
      return res.status(400).json('you haven\'t root to redact the book');
    }
    Object.assign(book, req.body);
    await book.save();
    return res.status(200).json(book);
  }
  catch (e) {
    console.log(e);
  }
})

//видалити книгу
router.delete('/:id/delete', auth, async (req, res) => {
  try {
    const { userId } = req.body;
    const book = await Books.findById(req.params.id);
    if (!book) {
      return res.status(400).json('No such book');
    }
    if (req.session.user._id != userId) {
      return res.status(400).json('you havent root to change book');
    }
    if (book.userId != req.session.user._id.toString()) {
      return res.status(400).json('you didnt make this book');
    }
    await Books.findByIdAndDelete(req.params.id);


    res.status(200).json('book was deleted');
  }
  catch (e) {
    console.log(e);
  }
});


module.exports = router;
