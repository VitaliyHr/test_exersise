import { FindUserById } from '../servises/user.servise';
import avatar from '../middlewares/avatar';

export default async function Profile(req, res, next) {
  let user;
  try {
    user = await FindUserById(req.session.user._id);
  } catch (err) {
    console.log(err);
    const error = `Failed to find user by userId ${req.session.user._id}. Source:${err}`;
    res.status(500).send(error);
    return next();
  }
  if (req.files) {
    return avatar(req, res, next, user);
  }

  res.status(400).send('image not found');
  return next();
}
