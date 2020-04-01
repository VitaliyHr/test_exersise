'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var mime = ['image/jpg', 'image/img', 'image/jpeg'];

exports.default = async function (req, res, next, user) {
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

  try {
    await avatar.mv(way, function (err) {
      if (err) {
        res.status(400).json({ success: false, error: { name: "Path error", message: "Some error in saving photo on server" } });
        return next();
      }
    });

    await user.save();
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: { name: "Critical error", message: "Falied while writing into a file", errorSthamp: err } });
  }

  res.status(201).json({ success: true, user: user });
  return next();
};