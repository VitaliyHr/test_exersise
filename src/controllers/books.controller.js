import { GetBooks, AddBook, FindBookByID, FindAndDelete } from '../servises/books.servise';
import { FindUserById } from '../servises/user.servise';
import { BookCounter } from '../middlewares/BookCounter';
import _ from 'lodash';

export async function getBooksForUnlogined(req, res, next) {
  let allbooks;
  try{
    allbooks = await GetBooks();
  }
  catch(err){
    console.log(err);
    res.status(500).json({success:false, error:{name:"Critical error", message:"Failed while finding books", errorSthamp:err}});
    return next();
  }
  
  const books=_.filter(allbooks,(b)=>b.score>=2);
  res.status(200).json({ success:true, books});
  return next();
}

export async function getBooksForLogined(req, res, next) {
  let books;
  try{
    books = await GetBooks();
  }
  catch(err){
    console.log(err);
    res.status(500).json({success:false, error:{name:"Citical error",message:"Failed while getting books", errorSthamp:err}});
    return next();
  }

  res.status(200).json({ success:true,books});
  return next();
}

export async function AddBooks(req, res, next) {
  const { title, author, isFinished, notes } = req.body;
  let book;
  try{
    book = await AddBook(title, author, isFinished, notes, req.session.user._id);
  }
  catch(err){
    console.log(err);
    res.status(500).json({success:false, error:{name:"Critical error", message:"Failed while adding book", errorSthamp:err}});
    return next();
  }
  res.status(200).json({ success:true, book});
  return next();
}

export async function SetOwn(req, res, next) {
  let book, user;
  try{
    book = await FindBookByID(req.params.id);
    user = await FindUserById(req.session.user._id);
  }
  catch(err){
    console.log(err);
    res.status(500).json({success:false, error:{ name:"Critical error", message:"Failed while finding user or book", errorSthamp:err}})
    return next();
  }

  if (!book) {
    res.status(400).json({ success:false, error:{ name:"Database error", message:"No such book"}});
    return next();
  }
  if (!user) {
    res.status(400).json({ success:false, error:{ name:"Database error", message:"No such user"}});
    return next();
  }
  user.books.push(book.id);

  await BookCounter(req,res,next,book);

  await user.save();
  res.status(201).json({ success:true, user });
  return next();
}

export async function GetOwn(req, res, next) {
  let user;
  try{
    user = await (await FindUserById(req.session.user._id)).populate('books._id').execPopulate();
  }
  catch(err){
    console.log(err);
    res.status(500).json({success:false, error:{name:"Citical error", message:"Failed while finding user", errorSthamp:err}});
    return next();
  }

  if (req.body.filterBy) {
    const { filterBy } = req.body;
    
    if (filterBy == 'author') {
      const books = _.filter(user.books,(b)=>b._id.author==req.body.author);
      res.status(200).json({ success:true,books});
      return next();
    }

    if (filterBy == 'isFinished') {
      const books = _.filter(user.books,(b)=>b._id.isFinished===JSON.parse(req.body.isFinished));
      res.status(200).json({ success:true, books });
      return next();
    }
  }
  res.status(200).json({ success:true, books:user.books});
  return next();
}

export async function BookInfo(req, res, next) {
  let book;
  try{
    book = await FindBookByID(req.params.id);
  }
  catch(err){
    console.log(err);
    res.status(500).json({success:false, error:{name:"Cititcal error", message:"Failed while finding book", errorSthamp:err}});
    return next();
  }

  if (!book) {
    res.status(404).json({success:false, error:{ name:"Datatbase error", message:"cannot find such book"}});
    return next();
  }
  res.status(200).json({ success:true, book});
  return next();
}

export async function EditBook(req, res, next) {
  const { user } = await req.session;
  let book;
  try{
    book = await FindBookByID(req.params.id);
  }
  catch(err){
    console.log(err);
    res.status(500).json({success:false, error:{name:"Critical error", message:"Failed while finding book", errorSthamp:err}});
    return next();
  }
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
  let book;
  try{
    book = await FindBookByID(req.params.id);
  }catch(err){
    console.log(err)
    res.status(500).json({ success:false, error:{name:"Critical error", message:"Failed while finding book", errorSthamp:err}});
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
  try{
  const user = await FindUserById(req.session.user._id);
  user.books.filter(b=>b._id==book.id?undefined:b);
  await user.save();
  await FindAndDelete(book.id);
  }
  catch(err){
    console.log(err);
    res.status(500).json({success:false, error:{name:"Critical error", message:"Failed while finding user or deleting book",errorSthamp:err}});
    return next();
  }
  res.status(204).json({ success:true,message:'book was deleted'});
  return next();
}
