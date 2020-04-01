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

  var candidate = void 0,
      pass = void 0;

  try {
    candidate = await (0, _user.FindUserByEmail)(email);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: { name: "Critical error", message: "Failed while finding user", errorSthamp: err } });
    return next();
  }

  if (!candidate) {
    res.status(404).json({ success: false, error: { name: "Database error", message: "No user in db" } });
    return next();
  }

  try {
    pass = await (0, _bcryptjs.compare)(req.body.password, candidate.password);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: { name: "Critical error", message: "Failed while comparing password", errorSthamp: err } });
    return next();
  }

  if (!pass) {
    res.status(400).json({ success: false, error: { name: "Access error", message: "Invalid password" } });
    return next();
  }
  return await (0, _session.session_db)(req, res, next, candidate);
}

async function register_controller(req, res, next) {
  var _req$body = req.body,
      email = _req$body.email,
      password = _req$body.password;


  var candidate = void 0,
      hashed_password = void 0,
      user = void 0;
  try {
    candidate = await (0, _user.FindUserByEmail)(email);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: { name: "Critical error", message: "Fail while finding user", errorSthamp: err } });
    return next();
  }

  if (candidate) {
    res.status(404).json({ success: false, error: { name: "Database error", message: "User have alerady exist" } });
    return next();
  }
  try {
    hashed_password = await (0, _bcryptjs.hash)(password, _index.SALT);
    user = await (0, _user.CreateUser)(email, hashed_password, []);
    await user.save();
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: { name: "Critical error", message: "Failed while hashing or creating user", errorSthamp: err } });
    return next();
  }

  if (req.files) {
    return (0, _avatar2.default)(req, res, next, user);
  }

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

    var user = void 0,
        pass = void 0;
    try {
      user = await (0, _user.FindUserById)(req.params.id);
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, error: { name: "Critical error", message: "Failed while finding user", errorSthamp: err } });
      return next();
    }

    if (!user) {
      res.status(404).json({ success: false, error: { name: "Access error", message: "User not found" } });
      return next();
    }
    try {
      pass = await (0, _bcryptjs.compare)(password, user.password);
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, error: { name: "Critical error", message: "Failed while comparing password", errorSthamp: err } });
      return next();
    }

    if (!pass) {
      res.status(400).json({ success: false, error: { name: "Access error", message: "invalid password" } });
      return next();
    }
    user.resetToken = buffer.toString('hex');
    var token = user.resetToken;
    user.dateToken = Date.now() + 60 * 60 * 1000;

    try {
      await user.save();
      await (0, _email.sendEmail)(user.email, token);
    } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, error: { name: "Critical error", message: "Failed while saving user", errorSthamp: err } });
      return next();
    }

    res.status(200).json({ success: true, user: user });
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

  var candidate = void 0,
      hashpass = void 0;
  try {
    candidate = await (0, _user.CheckToken)(token);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "Critical error", message: "Failed while checking token", errorSthamp: err });
    return next();
  }
  if (!candidate) {
    res.status(404).json({ success: false, error: { name: "Database error", message: "no such user" } });
    return next();
  }
  try {
    hashpass = await (0, _bcryptjs.hash)(password, _index.SALT);
    candidate.password = hashpass;
    candidate.resetToken = undefined;
    candidate.dateToken = undefined;
    await candidate.save();
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: { name: "Critical error", message: "Failed while hashing password", errorSthamp: err } });
    return next();
  }

  res.status(201).json({ success: true, user: candidate });
  return next();
}

async function Logout(req, res, next) {
  req.session.destroy(function () {
    res.status(203).json({ success: true });
    return next();
  });
}