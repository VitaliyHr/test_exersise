import { GetBooks, AddBook, FindBookByID, FindAndDelete } from '../servises/books.servise';
import { FindUserById } from '../servises/user.servise';

export async function getBooksForUnlogined(req, res, next) {
  const allbooks = await GetBooks();
  const books = allbooks.filter((book) => book.score >= 2);
  res.status(200).json({ success:true, books});
  return next();
}

export async function getBooksForLogined(req, res, next) {
  const books = await GetBooks();
  res.status(200).json({ success:true,books});
  return next();
}

export async function AddBooks(req, res, next) {
  const { title, author, isFinished, notes } = req.body;
  const book = await AddBook(title, author, isFinished, notes, req.session.user._id);
  res.status(200).json({ success:true, book});
  return next();
}

export async function SetOwn(req, res, next) {
  const book = await FindBookByID(req.params.id);
  
  if (!book) {
    res.status(400).json({ success:false, error:{ name:"Database error", message:"No such book"}});
    return next();
  }
  const user = await FindUserById(req.session.user._id);
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
  res.status(201).json({ success:true, user });
  return next();
}

export async function GetOwn(req, res, next) {
  const user = await (await FindUserById(req.session.user._id)).populate('books._id').execPopulate();

  if (req.body.filterBy) {
    const { filterBy } = req.body;
    
    if (filterBy == 'author') {
      const books = user.books.map((b) =>b._id.author=== req.body.author?b._id:undefined);
      res.status(200).json({ success:true,books});
      return next();
    }

    if (filterBy == 'isFinished') {
      const books = user.books.map((b) => b._id.isFinished == JSON.parse(req.body.isFinished)?b._id:undefined);
      res.status(200).json({ success:true, books });
      return next();
    }
  }
  res.status(200).json({ success:true, books:user.books});
  return next();
}

export async function BookInfo(req, res, next) {
  const book = await FindBookByID(req.params.id);
  if (!book) {
    res.status(404).json({success:false, error:{ name:"Datatbase error", message:"cannot find such book"}});
    return next();
  }
  res.status(200).json({ success:true, book});
  return next();
}

export async function EditBook(req, res, next) {
  const { user } = await req.session;
  const book = await FindBookByID(req.params.id);
  if (!book) {
    res.status(404).json({ success:false, error:{ name:"Database error", name:"invalid book"}});
    return next();
  }

  if (book.userId.toString() != user._id) {
    res.status(400).json({success:false, error:{ name: 'Unequal error', message: 'can\'t redact becouse of root' }});
    return next();
  }
  Object.assign(book, req.body);
  await book.save();
  res.status(200).json({ success:true, book});
  return next();
}

export async function DeleteBook(req, res, next) {
  let book={};
  try{
    book = await FindBookByID(req.params.id);
  }catch(error){
    res.status(400).json({error})
    return next();
  }
  
  if (!book) {
    res.status(404).json({ success:false, error:{ name:"Database error", message:"No such book"}});
    return next();
  }

  if (book.userId.toString()!= req.session.user._id.toString()) {
    res.status(400).json({ success:false, error:{ name:"Access error", message:"you can\'t delete becouse of root"}});
    return next();
  }
  const user = await FindUserById(req.session.user._id);
  user.books.filter(b=>b._id==book.id?undefined:b);
  await user.save();
  await FindAndDelete(book.id);
  res.status(204).json({ success:true,message:'book was deleted'});
  return next();
}
