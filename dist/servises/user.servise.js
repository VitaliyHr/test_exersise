'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FindUserById = FindUserById;
exports.FindUserByEmail = FindUserByEmail;
exports.CreateUser = CreateUser;
exports.CheckToken = CheckToken;

var _user = require('../models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function FindUserById(id) {
  if (id) {
    return await _user2.default.findById(id);
  }
}

async function FindUserByEmail(email) {
  if (email) {
    return await _user2.default.findOne({ email: email });
  }
}

async function CreateUser(email, password, books) {
  var user = new _user2.default({
    email: email, password: password, books: books
  });
  await user.save();
  return user;
}

async function CheckToken(token) {
  var user = await _user2.default.findOne({
    resetToken: token,
    dateToken: { $gt: Date.now() }
  });
  if (user) {
    return user;
  }
}