import { Router } from 'express';
import auth from '../middlewares/auth';
import Profile from '../controllers/profile';


const CreateRouter = () => {
  const router = Router();

  // зміна avatara
  router.post('/', auth, Profile);

  return router;
};


export default {
  CreateRouter,
};
