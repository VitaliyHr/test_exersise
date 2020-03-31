'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login_controller = login_controller;
exports.register_controller = register_controller;
exports.reset_controller = reset_controller;
exports.getReset = getReset;
exports.SetPass = SetPass;
exports.Logout = Logout;

var _bcryptjs = require('bcryptjs');

var _crypto = require('crypto');

var _user = require('../servises/user.servise');

var _index = require('../keys/index');

var _avatar = require('../middlewares/avatar');

var _avatar2 = _interopRequireDefault(_avatar);

var _email = require('../servises/email.servise');

var _session = require('../servises/session.servise');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function login_controller(req, res, next) {
  var email = req.body.email;

  var candidate = await (0, _user.FindUserByEmail)(email);

  if (!candidate) {
    res.status(404).json({ success: false, error: { name: "Database error", message: "No user in db" } });
    return next();
  }
  var pass = await (0, _bcryptjs.compare)(req.body.password, candidate.password);
  if (!pass) {
    res.status(400).json({ success: false, error: { name: "Access error", message: "Invalid password" } });
    return next();
  }
  (0, _session.session_db)(req, res, next, candidate);
  res.status(200).json({ success: true, user: req.session.user });
  return next();
}

async function register_controller(req, res, next) {
  var _req$body = req.body,
      email = _req$body.email,
      password = _req$body.password,
      confirm = _req$body.confirm;


  if (password !== confirm) {
    res.status(400).json({ success: false, error: { name: "Validation error", message: "password and confirm is not equal" } });
    return next();
  }
  var candidate = await (0, _user.FindUserByEmail)(email);
  if (candidate) {
    res.status(404).json({ success: false, error: { name: "Database error", message: "User have alerady exist" } });
    return next();
  }
  var hashed_password = await (0, _bcryptjs.hash)(password, _index.SALT);
  var user = await (0, _user.CreateUser)(email, hashed_password, []);

  if (req.files) {
    return (0, _avatar2.default)(req, res, next, user);
  }
  await user.save();
  res.status(201).json({ success: true, user: user });
  return next();
}

function reset_controller(req, res, next) {
  (0, _crypto.randomBytes)(32, async function (err, buffer) {
    if (err) {
      res.status(500).json({ error: { name: "Critical error of server", message: "Error in crypto" } });
      return next();
    }
    var password = req.body.password;

    var user = await (0, _user.FindUserById)(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, error: { name: "Access error", message: "User not found" } });
      return next();
    }
    var pass = await (0, _bcryptjs.compare)(password, user.password);

    if (!pass) {
      res.status(400).json({ success: false, error: { name: "Access error", message: "invalid password" } });
      return next();
    }
    user.resetToken = buffer.toString('hex');
    var token = user.resetToken;
    user.dateToken = Date.now() + 60 * 60 * 1000;
    await user.save();

    res.status(200).json({ success: true, user: user });
    await (0, _email.sendEmail)(user.email, token);
    return next();
  });
}

function getReset(req, res, next) {
  res.status(200).json({ success: true, data: { token: req.params.token } });
  return next();
}

async function SetPass(req, res, next) {
  var _req$body2 = req.body,
      token = _req$body2.token,
      password = _req$body2.password;

  var candidate = await (0, _user.CheckToken)(token);

  if (!candidate) {
    res.status(404).json({ success: false, error: { name: "Database error", message: "no such user" } });
    return next();
  }
  var hashpass = await (0, _bcryptjs.hash)(password, _index.SALT);
  candidate.password = hashpass;
  candidate.resetToken = undefined;
  candidate.dateToken = undefined;
  await candidate.save();

  res.status(201).json({ success: true, user: candidate });
  return next();
}

async function Logout(req, res, next) {
  req.session.destroy(function () {
    res.status(204).json({ success: true });
    return next();
  });
}