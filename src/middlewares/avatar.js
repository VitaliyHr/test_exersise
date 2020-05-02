import { SaveUserChanges } from '../servises/user.servise';
import log4js from './loggerConfig';

const logger = log4js.getLogger('error');

const mime = ['image/jpg', 'image/img', 'image/jpeg'];

export default async (req, res, next, user) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    const error = 'Image not found';
    res.status(404).json({ success: false, error });
    return next(new Error(error));
  }

  const { avatar } = req.files;

  if (!mime.includes(avatar.mimetype)) {
    const error = 'The file must be a image';
    res.status(400).json({ success: false, error });
    return next(new Error(error));
  }

  if ((avatar.size / 1024) > 2048) {
    const error = 'Image is bigger than 2mb';
    res.status(400).json({ success: false, error });
    return next(new Error(error));
  }

  const way = `./images/${`${Date.now()}-${avatar.name}`}`;
  user.avatar = way;

  try {
    await avatar.mv(way);
  } catch (err) {
    const error = 'Some error in saving photo on server';
    res.status(400).json({ success: false, error });
    return next(new Error(error));
  }


  try {
    await SaveUserChanges(user);
  } catch (err) {
    const error = `Failed to save changes in user by userId ${user.id}`;
    res.status(500).json({ success: false, error });
    return next(new Error(error));
  }
  logger.info(`Image userId ${user.id} was saved on server`);
  res.status(201).json({ success: true, user });
  return next();
};
