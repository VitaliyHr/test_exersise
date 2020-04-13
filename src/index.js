import express from 'express';
import { connect } from 'mongoose';
import fileUpload from 'express-fileupload';
import { join } from 'path';
import session from 'express-session';

import authRouter from './routes/auth';
import profileRouter from './routes/profile';
import booksRouter from './routes/books';
import { MONGODB_URI, SESSION_SECRET, PORT } from './keys/index';

const SessionStore = require('connect-mongodb-session')({ session });


const app = express();


const store = new SessionStore({
  collection: 'sessions',
  uri: MONGODB_URI,
});

app.use(express.static(join(__dirname, 'images')));

app.use(express.urlencoded({ extended: true }));

app.use(fileUpload());

app.use(express.json());

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: SESSION_SECRET,
  store,
}));

app.use('/auth', authRouter);

app.use('/profile', profileRouter);

app.use('/books', booksRouter);


async function start() {
  try {
    await connect(MONGODB_URI, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    app.listen(PORT, () => {
      console.log(`Server is alive on ${PORT}`);
    });
  } catch (e) {
    console.log(e);
    const error = `Failed to connect to mongoDB. Error:${e}`;
    throw new Error(error);
  }
}
start();
