'use strict';

var mime = ['image/jpg', 'image/img', 'image/jpeg'];
module.exports = async function (req, res, next, user) {
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).json({ success: false, error: { name: "Profile error", message: "No files were uploaded." } });
    return next();
  }

  var avatar = req.files.avatar;

  if (!mime.includes(avatar.mimetype)) {
    res.status(400).json({ success: false, error: { name: "Mimetype error", message: "The file must be a image" } });
    return next();
  }

  if (avatar.size / 1024 > 2048) {
    res.status(400).json({ success: false, error: { name: "Size limit", message: "image is bigger than 2mb" } });
    return next();
  }

  var way = './images/' + (Date.now() + '-' + avatar.name);
  user.avatar = way;

  await avatar.mv(way, function (err) {
    if (err) {
      res.status(400).json({ success: false, error: { name: "Path error", message: "Some error in saving photo on server" } });
      return next();
    }
  });

  await user.save();
  res.status(201).json({ success: true, user: user });
  return next();
};