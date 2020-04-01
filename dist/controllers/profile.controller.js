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
  var user = void 0;
  try {
    user = await (0, _user.FindUserById)(req.session.user._id);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: { name: "Critical error", message: "Failed while finding user", errorSthamp: err } });
    return next();
  }
  if (req.files) {
    return (0, _avatar2.default)(req, res, next, user);
  }
  await user.save();
  res.status(400).json({ success: false, error: { name: "Request error", message: "File not found" } });
  return next();
}