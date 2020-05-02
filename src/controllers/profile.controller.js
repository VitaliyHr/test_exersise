import { FindUserById } from '../servises/user.servise';
import avatar from '../middlewares/avatar';

export default async function Profile(req, res, next) {
  let user;
  try {
    user = await FindUserById(req.session.user._id);
  } catch (err) {
    const error = `Failed to find user by userId ${req.session.user._id}`;
    res.status(500).json({ success: false, error });
    return next(new Error(error));
  }
  if (!req.files) {
    const error = 'image not found';
    res.status(404).json({ success: false, error });
    return next(new Error(error));
  }

  return avatar(req, res, next, user);
}
