import { Router } from 'express';
import auth from '../middlewares/auth';
import { Profile } from '../controllers/profile.controller';

const router = Router();

//зміна avatara
router.post('/', auth, Profile);


export default router;
