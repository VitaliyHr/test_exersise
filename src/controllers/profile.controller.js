import { FindUserById } from '../servises/user.servise';
import avatar from '../middlewares/avatar';

export async function Profile(req, res, next) {
  const user = await FindUserById(req.session.user._id);
  if (req.files) {
    return avatar(req, res, next, user);
  }
  await user.save();
  res.status(400).json({ success:false, user});
  return next();
}
