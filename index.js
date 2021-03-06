const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');


const session = require('express-session');
const SessionStore = require('connect-mongodb-session')({ session });
const mongoose = require('mongoose');


const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const booksRouter = require('./routes/books');

const keys = require('./keys/index');


const app = express();

const PORT = process.env.PORT || 3000;


const store = new SessionStore({
  collection: 'sessions',
  uri: keys.MONGODB_URI,
});

app.use(express.static(path.join(__dirname, 'images')));

app.use(express.urlencoded({ extended: true }));

app.use(fileUpload());

app.use(express.json());

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: keys.SESSION_SECRET,
  store,
}));



app.use('/auth', authRouter);

app.use('/profile', profileRouter);

app.use('/books', booksRouter);


async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    app.listen(PORT, () => {
      console.log(`Server is alive on ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
