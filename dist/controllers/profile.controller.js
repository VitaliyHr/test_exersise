'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Profile = Profile;

var _user = require('../servises/user.servise');

var _avatar = require('../middlewares/avatar');

var _avatar2 = _interopRequireDefault(_avatar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function Profile(req, res, next) {
  var user = await (0, _user.FindUserById)(req.session.user._id);
  if (req.files) {
    return (0, _avatar2.default)(req, res, next, user);
  }
  await user.save();
  res.status(400).json({ success: false, user: user });
  return next();
}