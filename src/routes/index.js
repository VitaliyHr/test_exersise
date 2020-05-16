import { Router } from 'express';
import auth from './auth';
import books from './books';
import profile from './profile';

const CreateRouter = () => {
  const app = Router();

  app.use('/auth', auth.CreateRouter());

  app.use('/books', books.CreateRouter());

  app.use('/profile', profile.CreateRouter());

  app.use((req, res, next) => {
    if (!res.headersSent) {
      res.status(404).json({ success: false, error: 'Invalid url'});
      return next();
    }
    return next();
  });

  return app;
};

export default {
  CreateRouter,
};
