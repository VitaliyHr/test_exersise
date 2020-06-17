import { Router } from 'express';
import auth from './auth';
import books from './books';
import profile from './profile';

const CreateRouter = () => {
  const app = Router();

  app.use('/auth', auth.CreateRouter());

  app.use('/books', books.CreateRouter());

  app.use('/profile', profile.CreateRouter());

  return app;
};

export default {
  CreateRouter,
};
