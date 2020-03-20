
const mime = ['image/jpg', 'image/img', 'image/jpeg'];
module.exports = async function (req, res, user) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json('No files were uploaded.');
  }

  const { avatar } = req.files;
  if (!mime.includes(avatar.mimetype)) {
    return res.status(400).json('The file must be a image');
  }

  if ((avatar.size / 1024) > 2048) {
    return res.status(400).json('image is bigger than 2mb');
  }

  const way = `./images/${ Date.now() + '-' + avatar.name }`;
  user.avatar = way;

  avatar.mv(way, (err) => {
    if (err) {
      console.log(err);
    }
  });

  await user.save();
  return res.status(201).json(user);
};
