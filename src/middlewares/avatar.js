import { SaveUserChanges } from '../servises/user.servise';

const mime = ['image/jpg', 'image/img', 'image/jpeg'];

export default async (req, res, next, user) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return next();
  }

  const { avatar } = req.files;
  if (!mime.includes(avatar.mimetype)) {
    res.status(400).send('The file must be a image');
    return next();
  }

  if ((avatar.size / 1024) > 2048) {
    res.status(400).send('image is bigger than 2mb');
    return next();
  }

  const way = `./images/${`${Date.now()}-${avatar.name}`}`;
  user.avatar = way;


  try {
    await avatar.mv(way, (err) => {
      if (err) {
        res.status(400).json({ success: false, error: { message: 'Some error in saving photo on server', errorSthamp: err } });
        return next();
      }
    });
  } catch (err) {
    console.log(err);
    const error = 'Falied while writing into a file';
    res.status(500).send(error);
    return next();
  }

  try {
    await SaveUserChanges(user);
  } catch (err) {
    console.log(err);
    const error = `Failed to save changes in user by userId ${user.id}. Source:${err}`;
    res.status(500).send(error);
    return next();
  }

  res.status(201).json({ success: true, user });
  return next();
};
