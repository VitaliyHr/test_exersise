const user_servise = require('../servises/user.servise');
const avatar = require('../middlewares/avatar');

exports.Profile = async (req, res, next) => {
  const user = await user_servise.FindUserById(req.session.user._id);
  if (req.files) {
    return await avatar(req, res, user);
  }
  await user.save();
  res.status(400).json(user);
  return next();
}